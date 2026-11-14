import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import api from '../services/api';
import confetti from 'canvas-confetti';
import {
  CreditCard,
  Banknote,
  Lock,
  ShieldCheck,
  Phone,
  Sparkles,
  MapPin,
  ArrowRight,
  AlertCircle,
  Clock,
  User,
  Mail,
  FileText,
} from 'lucide-react';

const Checkout = () => {
  const { items, subtotal, coupon, totalKg, clearCart } = useCart();
  const { settings } = useSettings();
  const navigate = useNavigate();

  // Guest Shipping Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [area, setArea] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('Rajkot');
  const [state, setState] = useState('Gujarat');
  const [pincode, setPincode] = useState('360005');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');

  // Delivery & Payment
  const [deliveryType, setDeliveryType] = useState('local_rajkot');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Calculations
  const isFreeDelivery = subtotal >= (settings.freeDeliveryThreshold || 999);
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
      if (window.Razorpay) {
        return resolve(true);
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!items || items.length === 0) {
      setErrorMessage('Your snack basket is empty. Please add items before checking out.');
      return;
    }

    // Input Validation
    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    if (!cleanPhone || cleanPhone.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    if (!addressLine1.trim()) {
      setErrorMessage('Please enter your complete delivery street address (House/Flat/Building).');
      return;
    }

    if (!area.trim() && !addressLine2.trim()) {
      setErrorMessage('Please enter your area or locality.');
      return;
    }

    const cleanPincode = pincode.replace(/\D/g, '');
    if (!cleanPincode || cleanPincode.length !== 6) {
      setErrorMessage('Please enter a valid 6-digit delivery pincode.');
      return;
    }

    setIsSubmitting(true);

    try {
      const itemsPayload = items.map((it) => ({
        productId: it.productId,
        weightGrams: it.weightGrams,
        quantity: it.quantity,
      }));

      const orderPayload = {
        items: itemsPayload,
        shippingAddress: {
          fullName: fullName.trim(),
          phone: cleanPhone,
          email: email.trim(),
          addressLine1: addressLine1.trim(),
          area: (area || addressLine2).trim(),
          addressLine2: addressLine2.trim(),
          landmark: landmark.trim(),
          city: city.trim(),
          state: state.trim(),
          pincode: cleanPincode,
          deliveryInstructions: deliveryInstructions.trim(),
        },
        deliveryType,
        paymentMethod,
        couponCode: coupon?.code,
        customerNotes: deliveryInstructions.trim(),
      };

      // 1. Always create the order in MongoDB first
      const res = await api.post('/orders', orderPayload);

      if (!res.success || !res.order) {
        throw new Error(res.message || 'Failed to place order.');
      }

      const createdOrder = res.order;

      // 2. Handle Online Payment via Razorpay
      if (paymentMethod === 'razorpay' && res.razorpayOrder) {
        const isLoaded = await loadRazorpayScript();

        if (!isLoaded) {
          throw new Error('Razorpay secure payment checkout could not be loaded. Please check your internet connection.');
        }

        const options = {
          key: res.razorpayOrder.keyId || 'rzp_test_U067ePPL0xpTzN',
          amount: res.razorpayOrder.amount,
          currency: res.razorpayOrder.currency || 'INR',
          name: settings.storeName || 'Gujarati Homemade Nasta & Snacks',
          description: `Order #${createdOrder.orderNumber} Payment`,
          order_id: res.razorpayOrder.orderId,
          prefill: {
            name: fullName.trim(),
            email: email.trim() || 'orders@gujaratinasta.com',
            contact: cleanPhone,
          },
          theme: {
            color: '#790B13',
          },
          handler: async (response) => {
            try {
              // Server-side signature verification
              const verifyRes = await api.post('/payments/verify', {
                orderId: createdOrder._id,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });

              if (verifyRes.success) {
                confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
                clearCart();
                navigate(`/order-confirmed/${createdOrder.orderNumber}`);
              } else {
                setErrorMessage('Payment verification error: ' + (verifyRes.message || 'Signature mismatch'));
              }
            } catch (vErr) {
              setErrorMessage('Payment verification failed. Please contact us with Order #' + createdOrder.orderNumber);
            }
          },
          modal: {
            ondismiss: () => {
              setIsSubmitting(false);
              setErrorMessage(
                `Payment was not completed. Your order #${createdOrder.orderNumber} is saved. You can complete settlement via WhatsApp or retry payment.`
              );
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (resp) {
          setErrorMessage(`Payment failed: ${resp.error?.description || 'Transaction declined'}`);
          setIsSubmitting(false);
        });
        rzp.open();
        return;
      }

      // 3. Cash on Delivery Flow
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
      clearCart();
      navigate(`/order-confirmed/${createdOrder.orderNumber}`);
    } catch (err) {
      setErrorMessage(err.message || 'An error occurred while creating your order.');
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto py-28 px-4 text-center font-sans">
        <div className="w-16 h-16 rounded-full bg-[#FFF0DC] text-[#790B13] flex items-center justify-center mx-auto mb-4 border border-[#D6B77A]/40">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="font-heading font-black text-2xl uppercase tracking-tight text-[#21191A]">
          Your Snack Basket is Empty
        </h2>
        <p className="text-xs text-[#21191A]/70 font-sans mt-2 mb-6 leading-relaxed">
          Select fresh Kathiyawadi gathiya, chevdo, and chakdi before proceeding to guest checkout.
        </p>
        <Link
          to="/snacks"
          className="inline-block bg-[#790B13] hover:bg-[#50000D] text-[#FFF0DC] text-xs font-mono uppercase tracking-widest font-bold px-8 py-4 rounded-full shadow-lg shadow-[#790B13]/20 transition-all"
        >
          Browse All Snacks →
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-10 font-sans text-[#21191A] selection:bg-[#790B13] selection:text-white">
      {/* Header */}
      <div className="border-b border-[#D6B77A]/25 pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0DC] border border-[#D6B77A]/40 text-[#790B13] text-xs font-mono uppercase tracking-wider mb-2 font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[#D6B77A]" />
            <span>Instant Guest Checkout • No Account Needed</span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-5xl text-[#21191A] tracking-tight uppercase">
            Order & <span className="font-serif italic font-normal lowercase text-[#790B13]">delivery</span>
          </h1>
        </div>
        <div className="text-xs font-mono uppercase tracking-widest text-[#21191A]/70">
          <span>{items.length} items</span> • <span className="font-bold text-[#50000D]">{totalKg} kg net weight</span>
        </div>
      </div>

      {/* Guest Shopping Banner */}
      <div className="bg-[#FFF0DC] p-5 rounded-2xl border border-[#D6B77A]/40 flex items-center justify-between gap-4 text-xs shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 border border-[#D6B77A]/30 text-[#790B13]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="font-heading font-black text-sm text-[#50000D] uppercase tracking-wide block">
              Direct Kitchen Guest Shopping
            </span>
            <span className="text-[#21191A]/75 font-sans">
              Enter your address below. Upon placing your order, WhatsApp will open with your complete order message for Deepa Bhansali.
            </span>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl text-xs font-mono flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleCheckoutSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Form: Delivery Address & Payment */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Step 01: Dispatch Logistics */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#D6B77A]/30 shadow-sm space-y-5">
            <span className="text-[10px] uppercase font-mono tracking-widest font-bold text-[#790B13] bg-[#FFF0DC] border border-[#D6B77A]/40 px-3 py-1 rounded-full">
              Step 01 / Delivery Mode
            </span>
            <h2 className="font-heading font-black text-lg text-[#21191A] uppercase tracking-tight">
              Select Dispatch Logistics
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
                  {isFreeDelivery ? 'FREE Delivery' : `₹${settings.deliveryCharges?.localRajkot || 30}`}
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
                  Free (150ft Ring Rd)
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
                  {isFreeDelivery ? 'FREE Shipping' : `Express (₹${settings.deliveryCharges?.standardShipping || 70})`}
                </span>
              </label>
            </div>
          </div>

          {/* Step 02: Customer Details & Shipping Address */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#D6B77A]/30 shadow-sm space-y-5">
            <span className="text-[10px] uppercase font-mono tracking-widest font-bold text-[#790B13] bg-[#FFF0DC] border border-[#D6B77A]/40 px-3 py-1 rounded-full">
              Step 02 / Delivery Address
            </span>
            <h2 className="font-heading font-black text-lg text-[#21191A] uppercase tracking-tight">
              Customer & Delivery Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans text-xs">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-2 font-bold">
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
                <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-2 font-bold">
                  Mobile Number (10 Digits) *
                </label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9825012345"
                  className="w-full bg-[#FFF9F2] border border-[#D6B77A]/30 rounded-xl px-4 py-3.5 text-xs text-[#21191A] focus:outline-none focus:border-[#790B13] transition-colors font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-2 font-bold">
                  Complete Flat / House / Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  placeholder="e.g. Block B-204, Shreepad Residency, Main Road"
                  className="w-full bg-[#FFF9F2] border border-[#D6B77A]/30 rounded-xl px-4 py-3.5 text-xs text-[#21191A] focus:outline-none focus:border-[#790B13] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-2 font-bold">
                  Area / Locality *
                </label>
                <input
                  type="text"
                  required
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g. Mavdi / Kalawad Road"
                  className="w-full bg-[#FFF9F2] border border-[#D6B77A]/30 rounded-xl px-4 py-3.5 text-xs text-[#21191A] focus:outline-none focus:border-[#790B13] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-2">
                  Landmark (Optional)
                </label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Near Swaminarayan Temple"
                  className="w-full bg-[#FFF9F2] border border-[#D6B77A]/30 rounded-xl px-4 py-3.5 text-xs text-[#21191A] focus:outline-none focus:border-[#790B13] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-2 font-bold">
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
                <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-2 font-bold">
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
                <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-2 font-bold">
                  Pincode (6 Digits) *
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="360005"
                  className="w-full bg-[#FFF9F2] border border-[#D6B77A]/30 rounded-xl px-4 py-3.5 text-xs text-[#21191A] focus:outline-none focus:border-[#790B13] transition-colors font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-2">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="For tax invoice copy"
                  className="w-full bg-[#FFF9F2] border border-[#D6B77A]/30 rounded-xl px-4 py-3.5 text-xs text-[#21191A] focus:outline-none focus:border-[#790B13] transition-colors"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-2">
                  Special Delivery Instructions / Kitchen Notes
                </label>
                <textarea
                  rows={2}
                  value={deliveryInstructions}
                  onChange={(e) => setDeliveryInstructions(e.target.value)}
                  placeholder="e.g. Ring doorbell twice, vacuum seal each 500g pouch separately..."
                  className="w-full bg-[#FFF9F2] border border-[#D6B77A]/30 rounded-xl p-3.5 text-xs text-[#21191A] focus:outline-none focus:border-[#790B13] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Step 03: Payment Option */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#D6B77A]/30 shadow-sm space-y-5">
            <span className="text-[10px] uppercase font-mono tracking-widest font-bold text-[#790B13] bg-[#FFF0DC] border border-[#D6B77A]/40 px-3 py-1 rounded-full">
              Step 03 / Payment Method
            </span>
            <h2 className="font-heading font-black text-lg text-[#21191A] uppercase tracking-tight">
              Choose Payment Method
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
                    Order saved with status Pending. Pay upon delivery via cash or UPI scan.
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
                      Online Payment (Razorpay)
                    </span>
                  </div>
                  <span className="block text-[11px] text-[#21191A]/70 font-sans mt-1.5 leading-relaxed">
                    Instant verified payment via UPI, Google Pay, PhonePe, Cards, NetBanking.
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
                      <span className="font-heading font-black text-xs text-[#21191A] uppercase block">
                        {it.name}
                      </span>
                      <span className="text-[10px] font-mono text-[#21191A]/60">
                        {it.weightLabel} × {it.quantity}
                      </span>
                    </div>
                  </div>
                  <span className="font-heading font-black text-sm text-[#790B13]">
                    ₹{it.itemSubtotal}
                  </span>
                </div>
              ))}
            </div>

            {/* Financial Totals */}
            <div className="space-y-2.5 border-t border-[#D6B77A]/20 pt-4 text-xs font-mono">
              <div className="flex justify-between text-[#21191A]/70">
                <span>Items Subtotal</span>
                <span className="font-bold text-[#21191A]">₹{subtotal}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-[#790B13] font-bold">
                  <span>Promotional [{coupon?.code}]</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}

              <div className="flex justify-between text-[#21191A]/70">
                <span>Delivery Charges</span>
                <span className="font-bold text-[#21191A]">
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                </span>
              </div>

              <div className="pt-4 border-t border-[#D6B77A]/20 flex justify-between items-baseline font-heading">
                <span className="font-black text-sm uppercase text-[#21191A]">Grand Total:</span>
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
                {isSubmitting
                  ? 'Saving Order...'
                  : paymentMethod === 'razorpay'
                  ? `Pay Online • ₹${grandTotal}`
                  : `Place COD Order • ₹${grandTotal}`}
              </span>
              <ArrowRight className="w-4 h-4 text-[#D6B77A] group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="text-center text-[11px] text-[#21191A]/60 font-mono flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#790B13]" />
              <span>Secure Guest Checkout • Order Saved in MongoDB</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
