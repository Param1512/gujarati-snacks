import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import api from '../services/api';
import confetti from 'canvas-confetti';
import {
  CreditCard,
  Banknote,
  Lock,
  ShieldCheck,
  User,
  Mail,
  Phone,
  Sparkles,
  X,
  UserPlus,
  LogIn,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

const Checkout = () => {
  const { items, subtotal, coupon, totalKg, clearCart } = useCart();
  const { user, isAuthenticated, login, register } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');

  // Shipping Form State
  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('Rajkot');
  const [state, setState] = useState('Gujarat');
  const [pincode, setPincode] = useState('360005');
  const [customerNotes, setCustomerNotes] = useState('');

  // Delivery & Payment
  const [deliveryType, setDeliveryType] = useState('local_rajkot');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Checkout Authentication Modal State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState('register'); // 'register' | 'login'
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSubmitting, setAuthSubmitting] = useState(false);

  const applySavedAddress = (addr) => {
    setFullName(addr.fullName);
    setPhone(addr.phone);
    setAddressLine1(addr.addressLine1);
    setAddressLine2(addr.addressLine2 || '');
    setLandmark(addr.landmark || '');
    setCity(addr.city);
    setState(addr.state);
    setPincode(addr.pincode);
  };

  // Load saved addresses and update default name/phone if logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      if (!fullName) setFullName(user.name || '');
      if (!phone) setPhone(user.phone || '');

      api.get('/auth/addresses').then((res) => {
        if (res.success && res.addresses?.length > 0) {
          setSavedAddresses(res.addresses);
          const defaultAddr = res.addresses.find((a) => a.isDefault) || res.addresses[0];
          setSelectedAddressId(defaultAddr._id);
          applySavedAddress(defaultAddr);
        }
      });
    }
  }, [isAuthenticated, user]);

  const handleSelectSavedAddress = (e) => {
    const id = e.target.value;
    setSelectedAddressId(id);
    const chosen = savedAddresses.find((a) => a._id === id);
    if (chosen) applySavedAddress(chosen);
  };

  // Calculations
  const isFreeDelivery = subtotal >= settings.freeDeliveryThreshold;
  let deliveryFee = 0;
  if (deliveryType === 'customer_pickup') {
    deliveryFee = 0;
  } else if (isFreeDelivery) {
    deliveryFee = 0;
  } else {
    deliveryFee =
      deliveryType === 'standard_shipping'
        ? settings.deliveryCharges?.standardShipping || 70
        : settings.deliveryCharges?.localRajkot || 30;
  }

  const discountAmount = coupon ? coupon.discountAmount : 0;
  const grandTotal = Math.max(0, subtotal - discountAmount + deliveryFee);

  // Razorpay integration script loader
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Core Order Placement Logic (Assumes Authenticated User)
  const executePlaceOrder = async (overrideUserEmail = null) => {
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const itemsPayload = items.map((it) => ({
        productId: it.productId,
        weightGrams: it.weightGrams,
        quantity: it.quantity,
      }));

      const orderPayload = {
        items: itemsPayload,
        shippingAddress: {
          fullName,
          phone,
          addressLine1,
          addressLine2,
          landmark,
          city,
          state,
          pincode,
        },
        deliveryType,
        paymentMethod,
        couponCode: coupon?.code,
        customerNotes,
      };

      const res = await api.post('/orders', orderPayload);

      if (!res.success) {
        throw new Error(res.message || 'Failed to place order');
      }

      const createdOrder = res.order;

      // Handle Razorpay Payment flow if selected
      if (paymentMethod === 'razorpay' && res.razorpayOrder) {
        const isLoaded = await loadRazorpayScript();

        if (!isLoaded || res.razorpayOrder.orderId?.startsWith('order_mock_')) {
          await api.post('/payments/verify', {
            orderId: createdOrder._id,
            razorpayOrderId: res.razorpayOrder.orderId,
            razorpayPaymentId: `pay_test_${Date.now()}`,
            razorpaySignature: 'simulated_test_signature',
          });

          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
          clearCart();
          navigate(`/order/${createdOrder.orderNumber}`);
          return;
        }

        const options = {
          key: res.razorpayOrder.keyId || 'rzp_test_placeholder',
          amount: res.razorpayOrder.amount,
          currency: res.razorpayOrder.currency,
          name: settings.storeName,
          description: `Homemade Gujarati Snacks Order #${createdOrder.orderNumber}`,
          order_id: res.razorpayOrder.orderId,
          prefill: {
            name: fullName,
            email: overrideUserEmail || user?.email || authEmail || 'customer@example.com',
            contact: phone,
          },
          theme: {
            color: '#790B13',
          },
          handler: async (response) => {
            try {
              await api.post('/payments/verify', {
                orderId: createdOrder._id,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });

              confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
              clearCart();
              navigate(`/order/${createdOrder.orderNumber}`);
            } catch (vErr) {
              setErrorMessage('Payment verification error: ' + vErr.message);
            }
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
        return;
      }

      // Cash On Delivery
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      clearCart();
      navigate(`/order/${createdOrder.orderNumber}`);
    } catch (err) {
      setErrorMessage(err.message || 'Something went wrong while placing order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Called when user clicks "Place Order"
  const handleSubmitOrder = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!items || items.length === 0) {
      setErrorMessage('Your snack basket is empty.');
      return;
    }

    if (!fullName.trim() || !phone.trim() || !addressLine1.trim() || !pincode.trim()) {
      setErrorMessage('Please fill in all mandatory delivery address details before placing your order.');
      return;
    }

    // If user is NOT logged in, open the auth modal so order can be registered/saved to their account!
    if (!isAuthenticated) {
      setAuthName(fullName);
      setAuthPhone(phone);
      setAuthError('');
      setAuthTab('register'); // Default to new customer registration
      setShowAuthModal(true);
      return;
    }

    // Already authenticated, proceed with placing the order
    executePlaceOrder();
  };

  // Open modal manually from header banner
  const openAuthModal = (tab = 'register') => {
    setAuthName(fullName);
    setAuthPhone(phone);
    setAuthError('');
    setAuthTab(tab);
    setShowAuthModal(true);
  };

  // Handle Authentication inside the Modal
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSubmitting(true);

    try {
      let activeEmail = authEmail.trim();

      if (authTab === 'register') {
        if (!authName.trim()) {
          throw new Error('Please enter your full name');
        }
        if (!authEmail.trim()) {
          throw new Error('Please enter a valid email address');
        }
        if (authPassword.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }
        await register(authName.trim(), authEmail.trim(), authPassword, authPhone.trim());
      } else {
        if (!authEmail.trim() || !authPassword) {
          throw new Error('Please provide both email and password');
        }
        await login(authEmail.trim(), authPassword);
      }

      // Auth succeeded! Close modal
      setShowAuthModal(false);

      // If delivery address is completely filled, immediately execute the order!
      const isAddressFilled = fullName.trim() && phone.trim() && addressLine1.trim() && pincode.trim();
      if (isAddressFilled) {
        await executePlaceOrder(activeEmail);
      }
    } catch (err) {
      setAuthError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setAuthSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto py-28 px-4 text-center font-sans">
        <h2 className="font-heading font-black text-2xl uppercase tracking-tight text-[#21191A]">No Items in Bag</h2>
        <p className="text-xs text-[#21191A]/70 font-sans mt-2 mb-6">Please select your preferred snack weights before checking out.</p>
        <Link to="/snacks" className="inline-block bg-[#790B13] hover:bg-[#50000D] text-[#FFF0DC] text-xs font-mono uppercase tracking-widest font-bold px-8 py-4 rounded-full shadow-lg shadow-[#790B13]/20">
          Browse Snacks →
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-12 font-sans text-[#21191A] selection:bg-[#790B13] selection:text-white">
      {/* Editorial Header */}
      <div className="border-b border-[#D6B77A]/20 pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0DC] border border-[#D6B77A]/40 text-[#790B13] text-xs font-mono uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#D6B77A]" />
            <span>Final Settlement</span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-5xl text-[#21191A] tracking-tight uppercase">
            Delivery & <span className="font-serif italic font-normal lowercase text-[#790B13]">settlement</span>
          </h1>
        </div>
        <div className="text-xs font-mono uppercase tracking-widest text-[#21191A]/70">
          <span>{items.length} items</span> • <span className="font-bold text-[#21191A]">{totalKg} kg net consignment</span>
        </div>
      </div>

      {/* Patron Account Authentication Status Banner */}
      {isAuthenticated && user ? (
        <div className="bg-[#FFF0DC] p-5 rounded-2xl border border-[#D6B77A]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs shadow-xs">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-xs border border-[#D6B77A]/30">
              <CheckCircle2 className="w-5 h-5 text-[#790B13]" />
            </div>
            <div>
              <span className="font-heading font-black text-sm text-[#21191A] uppercase tracking-wide block">
                Signed in as {user.name}
              </span>
              <span className="text-[#21191A]/70 font-sans">
                ({user.email}) • This order will be linked to your patron profile for live dispatch updates.
              </span>
            </div>
          </div>
          <span className="text-[11px] font-mono uppercase tracking-widest font-bold text-[#FFF0DC] bg-[#790B13] px-4 py-1.5 rounded-full w-fit">
            Patron Linked ✓
          </span>
        </div>
      ) : (
        <div className="bg-[#FFF0DC] p-5 rounded-2xl border border-[#D6B77A]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs shadow-xs">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-xs border border-[#D6B77A]/30">
              <User className="w-5 h-5 text-[#790B13]" />
            </div>
            <div>
              <strong className="block text-sm font-heading font-black uppercase tracking-tight text-[#21191A]">
                Patron Identification
              </strong>
              <span className="text-[#21191A]/70 font-sans">
                New patrons can register seamlessly on order confirmation. Have an account? Sign in for saved addresses.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => openAuthModal('login')}
              className="px-5 py-2.5 bg-white border border-[#D6B77A]/40 text-[#21191A] text-xs font-mono uppercase tracking-wider font-bold rounded-full hover:border-[#790B13] transition-colors shadow-xs cursor-pointer"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => openAuthModal('register')}
              className="px-5 py-2.5 bg-[#790B13] text-[#FFF0DC] text-xs font-mono uppercase tracking-wider font-bold rounded-full hover:bg-[#50000D] transition-colors shadow-xs cursor-pointer"
            >
              Join Patronage
            </button>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl text-xs font-mono">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Form: Delivery, Address, Payment */}
        <div className="lg:col-span-7 space-y-8">
          {/* Saved Addresses selector if available */}
          {savedAddresses.length > 0 && (
            <div className="bg-white p-6 rounded-2xl border border-[#D6B77A]/30 shadow-sm space-y-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 font-bold">
                Select Saved Address
              </label>
              <select
                value={selectedAddressId}
                onChange={handleSelectSavedAddress}
                className="w-full bg-[#FFF9F2] border border-[#D6B77A]/30 rounded-xl p-3 text-xs text-[#21191A] focus:outline-none focus:border-[#790B13] cursor-pointer"
              >
                {savedAddresses.map((addr) => (
                  <option key={addr._id} value={addr._id}>
                    {addr.fullName} – {addr.addressLine1}, {addr.city} ({addr.pincode})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Delivery Mode Choice */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#D6B77A]/30 shadow-sm space-y-5">
            <span className="text-[10px] uppercase font-mono tracking-widest font-bold text-[#790B13] bg-[#FFF0DC] border border-[#D6B77A]/40 px-3 py-1 rounded-full">
              Step 01 / Dispatch Logistics
            </span>
            <h2 className="font-heading font-black text-lg text-[#21191A] uppercase tracking-tight">
              Choose Dispatch Logistics
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <label
                className={`p-4 rounded-2xl border flex flex-col justify-between cursor-pointer transition-all ${
                  deliveryType === 'local_rajkot'
                    ? 'border-[#790B13] bg-[#FFF0DC] shadow-sm'
                    : 'border-[#D6B77A]/30 bg-[#FFF9F2] hover:border-[#790B13]/40'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="radio"
                    name="deliveryType"
                    value="local_rajkot"
                    checked={deliveryType === 'local_rajkot'}
                    onChange={() => setDeliveryType('local_rajkot')}
                    className="accent-[#790B13]"
                  />
                  <span className="font-heading font-black text-xs uppercase text-[#21191A]">Rajkot Local</span>
                </div>
                <span className="text-[11px] text-[#21191A]/70 font-sans mt-2 block">
                  Same-day (₹{settings.deliveryCharges?.localRajkot || 30})
                </span>
              </label>

              <label
                className={`p-4 rounded-2xl border flex flex-col justify-between cursor-pointer transition-all ${
                  deliveryType === 'customer_pickup'
                    ? 'border-[#790B13] bg-[#FFF0DC] shadow-sm'
                    : 'border-[#D6B77A]/30 bg-[#FFF9F2] hover:border-[#790B13]/40'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="radio"
                    name="deliveryType"
                    value="customer_pickup"
                    checked={deliveryType === 'customer_pickup'}
                    onChange={() => setDeliveryType('customer_pickup')}
                    className="accent-[#790B13]"
                  />
                  <span className="font-heading font-black text-xs uppercase text-[#21191A]">Kitchen Pickup</span>
                </div>
                <span className="text-[11px] text-[#21191A]/70 font-sans mt-2 block">
                  Free (Rajkot Counter)
                </span>
              </label>

              <label
                className={`p-4 rounded-2xl border flex flex-col justify-between cursor-pointer transition-all ${
                  deliveryType === 'standard_shipping'
                    ? 'border-[#790B13] bg-[#FFF0DC] shadow-sm'
                    : 'border-[#D6B77A]/30 bg-[#FFF9F2] hover:border-[#790B13]/40'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="radio"
                    name="deliveryType"
                    value="standard_shipping"
                    checked={deliveryType === 'standard_shipping'}
                    onChange={() => setDeliveryType('standard_shipping')}
                    className="accent-[#790B13]"
                  />
                  <span className="font-heading font-black text-xs uppercase text-[#21191A]">Gujarat & India</span>
                </div>
                <span className="text-[11px] text-[#21191A]/70 font-sans mt-2 block">
                  Express (₹{settings.deliveryCharges?.standardShipping || 70})
                </span>
              </label>
            </div>
          </div>

          {/* Delivery Address Form */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#D6B77A]/30 shadow-sm space-y-5">
            <span className="text-[10px] uppercase font-mono tracking-widest font-bold text-[#790B13] bg-[#FFF0DC] border border-[#D6B77A]/40 px-3 py-1 rounded-full">
              Step 02 / Shipping Address
            </span>
            <h2 className="font-heading font-black text-lg text-[#21191A] uppercase tracking-tight">
              Destination & Recipient
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans text-xs">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ramesh Patel"
                  className="w-full bg-[#FFF9F2] border border-[#D6B77A]/30 rounded-xl px-4 py-3.5 text-xs text-[#21191A] focus:outline-none focus:border-[#790B13] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-2">
                  Mobile Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                  className="w-full bg-[#FFF9F2] border border-[#D6B77A]/30 rounded-xl px-4 py-3.5 text-xs text-[#21191A] focus:outline-none focus:border-[#790B13] transition-colors"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-2">
                  Flat / House / Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  placeholder="e.g. Block B-204, Shreepad Residency"
                  className="w-full bg-[#FFF9F2] border border-[#D6B77A]/30 rounded-xl px-4 py-3.5 text-xs text-[#21191A] focus:outline-none focus:border-[#790B13] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-2">
                  Area / Society
                </label>
                <input
                  type="text"
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                  placeholder="e.g. 150ft Ring Road, Near Mavdi"
                  className="w-full bg-[#FFF9F2] border border-[#D6B77A]/30 rounded-xl px-4 py-3.5 text-xs text-[#21191A] focus:outline-none focus:border-[#790B13] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-2">
                  Landmark
                </label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Opposite Swaminarayan Temple"
                  className="w-full bg-[#FFF9F2] border border-[#D6B77A]/30 rounded-xl px-4 py-3.5 text-xs text-[#21191A] focus:outline-none focus:border-[#790B13] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-[#FFF9F2] border border-[#D6B77A]/30 rounded-xl px-4 py-3.5 text-xs text-[#21191A] focus:outline-none focus:border-[#790B13] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-2">
                  State *
                </label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full bg-[#FFF9F2] border border-[#D6B77A]/30 rounded-xl px-4 py-3.5 text-xs text-[#21191A] focus:outline-none focus:border-[#790B13] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-2">
                  Pincode *
                </label>
                <input
                  type="text"
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="6-digit pincode"
                  className="w-full bg-[#FFF9F2] border border-[#D6B77A]/30 rounded-xl px-4 py-3.5 text-xs text-[#21191A] focus:outline-none focus:border-[#790B13] transition-colors"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-2">
                  Kitchen Notes / Special Packing Instructions
                </label>
                <textarea
                  rows={2}
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  placeholder="e.g. Ring the bell twice, pack in 250g separate pouches for gifting..."
                  className="w-full bg-[#FFF9F2] border border-[#D6B77A]/30 rounded-xl p-3.5 text-xs text-[#21191A] focus:outline-none focus:border-[#790B13] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Choice */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#D6B77A]/30 shadow-sm space-y-5">
            <span className="text-[10px] uppercase font-mono tracking-widest font-bold text-[#790B13] bg-[#FFF0DC] border border-[#D6B77A]/40 px-3 py-1 rounded-full">
              Step 03 / Settlement Mode
            </span>
            <h2 className="font-heading font-black text-lg text-[#21191A] uppercase tracking-tight">
              Select Settlement Option
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label
                className={`p-5 rounded-2xl border flex items-start gap-3.5 cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-[#790B13] bg-[#FFF0DC] shadow-sm'
                    : 'border-[#D6B77A]/30 bg-[#FFF9F2] hover:border-[#790B13]/40'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="mt-1 accent-[#790B13]"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <Banknote className="w-5 h-5 text-[#790B13]" />
                    <span className="block font-heading font-black text-xs uppercase text-[#21191A]">
                      Cash on Delivery (COD)
                    </span>
                  </div>
                  <span className="block text-[11px] text-[#21191A]/70 font-sans mt-1.5 leading-relaxed">
                    Pay upon doorstep delivery via cash or UPI scan.
                  </span>
                </div>
              </label>

              <label
                className={`p-5 rounded-2xl border flex items-start gap-3.5 cursor-pointer transition-all ${
                  paymentMethod === 'razorpay'
                    ? 'border-[#790B13] bg-[#FFF0DC] shadow-sm'
                    : 'border-[#D6B77A]/30 bg-[#FFF9F2] hover:border-[#790B13]/40'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="razorpay"
                  checked={paymentMethod === 'razorpay'}
                  onChange={() => setPaymentMethod('razorpay')}
                  className="mt-1 accent-[#790B13]"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-[#790B13]" />
                    <span className="block font-heading font-black text-xs uppercase text-[#21191A]">
                      UPI / Cards / Net Banking
                    </span>
                  </div>
                  <span className="block text-[11px] text-[#21191A]/70 font-sans mt-1.5 leading-relaxed">
                    Instant 256-bit encrypted checkout via Razorpay Gateway.
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Summary Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#D6B77A]/30 shadow-xl space-y-6 sticky top-28">
            <div className="border-b border-[#D6B77A]/20 pb-4">
              <span className="font-mono text-xs uppercase tracking-widest text-[#790B13] font-bold block mb-1">
                Final Bill
              </span>
              <h2 className="font-heading font-black text-xl text-[#21191A] uppercase tracking-tight">
                Order Summary ({items.length})
              </h2>
            </div>

            {/* Snack Line Items */}
            <div className="space-y-3.5 max-h-64 overflow-y-auto pr-1">
              {items.map((it) => (
                <div key={it.itemKey} className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={it.imageUrl || '/images/snacks/tikha-gathiya.jpg'}
                      alt=""
                      className="w-12 h-12 rounded-xl object-cover border border-[#D6B77A]/30"
                    />
                    <div>
                      <span className="font-heading font-black text-xs text-[#21191A] uppercase block">{it.name}</span>
                      <span className="text-[10px] font-mono text-[#21191A]/60">
                        {it.weightLabel} × {it.quantity}
                      </span>
                    </div>
                  </div>
                  <span className="font-heading font-black text-sm text-[#790B13]">₹{it.itemSubtotal}</span>
                </div>
              ))}
            </div>

            {/* Financial Totals */}
            <div className="space-y-2.5 border-t border-[#D6B77A]/20 pt-4 text-xs font-mono">
              <div className="flex justify-between text-[#21191A]/70">
                <span>Subtotal</span>
                <span className="font-bold text-[#21191A]">₹{subtotal}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-[#790B13] font-bold">
                  <span>Promotional [{coupon?.code}]</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}

              <div className="flex justify-between text-[#21191A]/70">
                <span>Delivery</span>
                <span className="font-bold text-[#21191A]">
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                </span>
              </div>

              <div className="pt-4 border-t border-[#D6B77A]/20 flex justify-between items-baseline font-heading">
                <span className="font-black text-sm uppercase text-[#21191A]">Total Payable:</span>
                <span className="font-black text-3xl text-[#790B13]">₹{grandTotal}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#790B13] hover:bg-[#50000D] text-[#FFF0DC] py-4 rounded-full text-xs font-mono uppercase tracking-widest font-bold flex items-center justify-center gap-2 shadow-xl shadow-[#790B13]/30 transition-all cursor-pointer disabled:opacity-50 active:scale-98 group"
            >
              <Lock className="w-4 h-4 text-[#D6B77A]" />
              <span>
                {isSubmitting ? 'Confirming...' : `Confirm Order • ₹${grandTotal}`}
              </span>
              <ArrowRight className="w-4 h-4 text-[#D6B77A] group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="text-center text-[11px] text-[#21191A]/60 font-mono flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#790B13]" />
              <span>Encrypted Settlement • Pure Groundnut Oil Guaranteed</span>
            </div>
          </div>
        </div>
      </form>

      {/* Checkout Authentication Dialog / Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#21191A]/75 backdrop-blur-xs transition-opacity"
            onClick={() => !authSubmitting && setShowAuthModal(false)}
          />

          {/* Modal Container */}
          <div className="relative bg-[#FFF9F2] rounded-3xl border border-[#D6B77A]/40 max-w-md w-full p-6 sm:p-8 shadow-2xl z-10 space-y-6">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowAuthModal(false)}
              className="absolute top-5 right-5 text-[#21191A]/50 hover:text-[#790B13] p-1.5 rounded-full hover:bg-[#FFF0DC] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Heading */}
            <div className="space-y-2 pr-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0DC] border border-[#D6B77A]/40 text-[#790B13] text-xs font-mono uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#D6B77A]" />
                <span>Patron Verification</span>
              </div>
              <h3 className="font-heading font-black text-2xl text-[#21191A] tracking-tight uppercase">
                {authTab === 'register' ? 'Register To Confirm Order' : 'Sign In To Account'}
              </h3>
              <p className="text-xs text-[#21191A]/70 font-sans leading-relaxed">
                {authTab === 'register'
                  ? 'Create your password to link this order for live dispatch tracking and express future orders.'
                  : 'Welcome back! Sign in to automatically link this order to your existing patron profile.'}
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="grid grid-cols-2 p-1 bg-white rounded-full border border-[#D6B77A]/30 text-xs font-mono uppercase tracking-wider font-bold">
              <button
                type="button"
                onClick={() => {
                  setAuthTab('register');
                  setAuthError('');
                }}
                className={`py-2.5 rounded-full transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  authTab === 'register'
                    ? 'bg-[#790B13] text-[#FFF0DC] shadow-xs'
                    : 'text-[#21191A]/60 hover:text-[#790B13]'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>New Patron</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthTab('login');
                  setAuthError('');
                }}
                className={`py-2.5 rounded-full transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  authTab === 'login'
                    ? 'bg-[#790B13] text-[#FFF0DC] shadow-xs'
                    : 'text-[#21191A]/60 hover:text-[#790B13]'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Existing Patron</span>
              </button>
            </div>

            {/* Error Message */}
            {authError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-2xl text-xs font-mono space-y-1">
                <div>{authError}</div>
                {authError.toLowerCase().includes('already exists') && (
                  <button
                    type="button"
                    onClick={() => {
                      setAuthTab('login');
                      setAuthError('');
                    }}
                    className="text-[#790B13] underline font-bold text-[11px] block mt-1 hover:text-[#50000D]"
                  >
                    Click here to Sign In with this email →
                  </button>
                )}
                {authError.toLowerCase().includes('invalid email or password') && (
                  <button
                    type="button"
                    onClick={() => {
                      setAuthTab('register');
                      setAuthError('');
                    }}
                    className="text-[#790B13] underline font-bold text-[11px] block mt-1 hover:text-[#50000D]"
                  >
                    New customer? Click here to Register →
                  </button>
                )}
              </div>
            )}

            {/* Auth Form */}
            <form onSubmit={handleAuthSubmit} className="space-y-4 font-sans text-xs">
              {authTab === 'register' && (
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-1.5">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#21191A]/40 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      placeholder="e.g. Ramesh Patel"
                      className="w-full bg-white border border-[#D6B77A]/30 rounded-xl pl-10 pr-4 py-3 text-xs text-[#21191A] focus:outline-none focus:border-[#790B13]"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#21191A]/40 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-white border border-[#D6B77A]/30 rounded-xl pl-10 pr-4 py-3 text-xs text-[#21191A] focus:outline-none focus:border-[#790B13]"
                  />
                </div>
              </div>

              {authTab === 'register' && (
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-1.5">
                    Mobile Phone *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#21191A]/40 absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      required
                      value={authPhone}
                      onChange={(e) => setAuthPhone(e.target.value)}
                      placeholder="10-digit mobile number"
                      className="w-full bg-white border border-[#D6B77A]/30 rounded-xl pl-10 pr-4 py-3 text-xs text-[#21191A] focus:outline-none focus:border-[#790B13]"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-1.5">
                  {authTab === 'register' ? 'Create Password (min. 6 chars) *' : 'Account Password *'}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#21191A]/40 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white border border-[#D6B77A]/30 rounded-xl pl-10 pr-4 py-3 text-xs text-[#21191A] focus:outline-none focus:border-[#790B13]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={authSubmitting}
                  className="w-full bg-[#790B13] hover:bg-[#50000D] text-[#FFF0DC] py-4 rounded-full font-mono uppercase tracking-widest text-xs font-bold transition-all shadow-lg shadow-[#790B13]/25 active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>
                    {authSubmitting
                      ? 'Authenticating & Placing Order...'
                      : authTab === 'register'
                      ? `Register & Place Order (₹${grandTotal}) →`
                      : `Sign In & Place Order (₹${grandTotal}) →`}
                  </span>
                </button>
              </div>

              <p className="text-[11px] text-[#21191A]/70 text-center font-sans pt-1">
                {authTab === 'register' ? (
                  <>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setAuthTab('login');
                        setAuthError('');
                      }}
                      className="font-bold text-[#790B13] underline hover:text-[#50000D]"
                    >
                      Sign In instead
                    </button>
                  </>
                ) : (
                  <>
                    New patron?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setAuthTab('register');
                        setAuthError('');
                      }}
                      className="font-bold text-[#790B13] underline hover:text-[#50000D]"
                    >
                      Create an account
                    </button>
                  </>
                )}
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
