import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  MessageCircle,
  Copy,
  Printer,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
  MapPin,
  Clock,
  Sparkles,
  Phone,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

const OrderConfirmationPage = () => {
  const { orderNumber } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [whatsappMessage, setWhatsappMessage] = useState('');
  const [recipient, setRecipient] = useState({ name: 'Deepa Bhansali', phone: '919426845625' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Fire celebratory confetti on arrival
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.5 },
      colors: ['#790B13', '#D6B77A', '#50000D', '#FFF0DC'],
    });

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/orders/confirmed/${orderNumber}`);
        if (res.success && res.order) {
          setOrderData(res.order);
          setWhatsappUrl(res.whatsappUrl || res.order.whatsappNotification?.waUrl || '');
          setWhatsappMessage(res.whatsappMessage || res.order.whatsappNotification?.formattedMessage || '');
          if (res.whatsappRecipient) {
            setRecipient(res.whatsappRecipient);
          }
        } else {
          setError(res.message || 'Unable to retrieve order details.');
        }
      } catch (err) {
        setError(err.message || 'Error loading confirmed order from server.');
      } finally {
        setLoading(false);
      }
    };

    if (orderNumber) {
      fetchOrder();
    }
  }, [orderNumber]);

  const handleCopyMessage = () => {
    if (whatsappMessage) {
      navigator.clipboard.writeText(whatsappMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleOpenWhatsApp = () => {
    if (whatsappUrl) {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF9F2] flex items-center justify-center p-6 text-center font-sans">
        <div className="space-y-4">
          <div className="w-12 h-12 border-3 border-[#790B13] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-heading font-black text-sm text-[#50000D] uppercase tracking-wider">
            Retrieving Confirmed Order #{orderNumber}...
          </p>
        </div>
      </div>
    );
  }

  if (error || !orderData) {
    return (
      <div className="min-h-screen bg-[#FFF9F2] flex items-center justify-center p-6 text-center font-sans">
        <div className="max-w-md bg-white p-8 sm:p-10 rounded-3xl border border-[#D6B77A]/30 shadow-xl space-y-4">
          <AlertCircle className="w-10 h-10 text-rose-700 mx-auto" />
          <h1 className="font-heading font-black text-xl text-[#50000D] uppercase">
            Order Record Notice
          </h1>
          <p className="text-xs text-[#21191A]/70 font-sans leading-relaxed">
            {error || 'Order could not be located in our database.'}
          </p>
          <Link
            to="/snacks"
            className="inline-block px-6 py-3 rounded-full bg-[#790B13] text-[#FFF0DC] font-heading font-bold text-xs uppercase tracking-wider"
          >
            Browse Snacks Store
          </Link>
        </div>
      </div>
    );
  }

  const isPaid = orderData.paymentStatus === 'paid';
  const isCod = orderData.paymentMethod === 'cod';

  return (
    <div className="min-h-screen bg-[#FFF9F2] text-[#21191A] py-12 sm:py-20 font-sans selection:bg-[#790B13] selection:text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top Status Card */}
        <div className="bg-white rounded-3xl border border-[#D6B77A]/30 p-6 sm:p-10 shadow-xl space-y-6 text-center sm:text-left relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#D6B77A] via-[#790B13] to-[#D6B77A]" />

          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 pb-6 border-b border-[#D6B77A]/20">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#FFF0DC] border border-[#D6B77A]/40 flex items-center justify-center text-[#790B13] shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#FFF0DC] border border-[#D6B77A]/40 text-[#790B13] text-[10px] font-mono uppercase tracking-widest mb-1 font-bold">
                  <ShieldCheck className="w-3 h-3 text-[#D6B77A]" />
                  <span>Order Saved in MongoDB Database</span>
                </div>
                <h1 className="font-heading font-black text-2xl sm:text-4xl text-[#50000D] uppercase tracking-tight">
                  Order Successfully <span className="font-serif italic font-normal lowercase text-[#790B13]">placed!</span>
                </h1>
                <p className="text-xs text-[#21191A]/70 font-sans mt-0.5">
                  Order Reference: <strong className="font-mono text-[#50000D] font-bold text-sm">{orderData.orderNumber}</strong>
                </p>
              </div>
            </div>

            {/* Payment Badge */}
            <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
              {isPaid ? (
                <span className="px-4 py-1.5 rounded-full text-xs font-mono uppercase font-bold tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>PAID (Razorpay)</span>
                </span>
              ) : (
                <span className="px-4 py-1.5 rounded-full text-xs font-mono uppercase font-bold tracking-wider bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-700" />
                  <span>COD • Pending Collection</span>
                </span>
              )}
              <span className="text-[11px] font-mono text-[#21191A]/60">
                {new Date(orderData.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>

          {/* CRITICAL WHATSAPP ACTION BOX */}
          <div className="bg-gradient-to-br from-[#128C7E]/10 via-[#FFF0DC] to-[#25D366]/10 p-6 sm:p-8 rounded-3xl border-2 border-[#128C7E]/40 space-y-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-md">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-heading font-black text-base text-[#128C7E] uppercase tracking-wide">
                    WhatsApp Order Placement Direct with Deepa Bhansali
                  </span>
                  <span className="text-[11px] font-mono font-bold text-[#128C7E] bg-white px-2.5 py-0.5 rounded-full border border-[#128C7E]/30">
                    +91 {recipient.phone?.slice(-10)}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#21191A] font-medium leading-relaxed">
                  Your order details are ready. WhatsApp will open with your complete order message. 
                  <strong className="text-[#50000D] font-bold"> Please press Send to share your order with us.</strong>
                </p>
              </div>
            </div>

            {/* Instruction Steps */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-[#D6B77A]/30">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#128C7E] text-white font-mono font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <span className="text-[#21191A]/80">
                  Click the <strong>Open WhatsApp</strong> button below.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#128C7E] text-white font-mono font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <span className="text-[#21191A]/80">
                  WhatsApp opens with your <strong>itemized order pre-filled</strong>.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#790B13] text-white font-mono font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <span className="text-[#21191A]/80 font-bold text-[#790B13]">
                  Press SEND in WhatsApp to confirm your fresh order!
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleOpenWhatsApp}
                className="flex-1 bg-[#25D366] hover:bg-[#128C7E] text-white py-4 px-6 rounded-full font-heading font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-lg shadow-[#25D366]/30 cursor-pointer transition-all active:scale-98"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Open WhatsApp & Send Order</span>
                <ExternalLink className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleCopyMessage}
                className="bg-white hover:bg-[#FFF9F2] text-[#21191A] border border-[#D6B77A]/50 py-4 px-6 rounded-full font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-colors"
                title="Copy full message text"
              >
                <Copy className="w-4 h-4 text-[#790B13]" />
                <span>{copied ? 'Copied Message!' : 'Copy Order Text'}</span>
              </button>
            </div>

            <p className="text-[11px] text-[#21191A]/60 font-sans italic text-center sm:text-left">
              * Note: WhatsApp click-to-chat links prepare the message safely. For privacy and delivery confirmation, please tap the green Send button inside WhatsApp.
            </p>
          </div>

          {/* Delivery & Recipient Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 font-sans text-xs">
            <div className="bg-[#FFF9F2] p-5 rounded-2xl border border-[#D6B77A]/30 space-y-2">
              <div className="flex items-center gap-2 text-[#50000D] font-heading font-black uppercase tracking-wider">
                <MapPin className="w-4 h-4 text-[#790B13]" />
                <span>Delivery Destination</span>
              </div>
              <p className="text-sm font-bold text-[#21191A]">
                {orderData.shippingAddress?.fullName}
              </p>
              <p className="text-[#21191A]/75 leading-relaxed">
                {orderData.shippingAddress?.addressLine1}
                {orderData.shippingAddress?.area ? `, ${orderData.shippingAddress.area}` : ''}
                {orderData.shippingAddress?.addressLine2 ? `, ${orderData.shippingAddress.addressLine2}` : ''}
                {orderData.shippingAddress?.landmark ? `, Near ${orderData.shippingAddress.landmark}` : ''}
                <br />
                {orderData.shippingAddress?.city}, {orderData.shippingAddress?.state} - {orderData.shippingAddress?.pincode}
              </p>
              <p className="font-mono text-[#50000D] font-bold">
                Phone: +91 {orderData.shippingAddress?.phone}
              </p>
              {orderData.customerNotes && (
                <div className="pt-2 border-t border-[#D6B77A]/20 text-[11px] text-[#21191A]/80">
                  <strong>Notes:</strong> {orderData.customerNotes}
                </div>
              )}
            </div>

            <div className="bg-[#FFF9F2] p-5 rounded-2xl border border-[#D6B77A]/30 space-y-2">
              <div className="flex items-center gap-2 text-[#50000D] font-heading font-black uppercase tracking-wider">
                <Phone className="w-4 h-4 text-[#790B13]" />
                <span>Kitchen Helpline & Dispatch</span>
              </div>
              <p className="text-sm font-bold text-[#21191A]">
                {recipient.name || 'Deepa Bhansali'}
              </p>
              <p className="text-[#21191A]/75 leading-relaxed">
                Direct WhatsApp: +91 {recipient.phone?.slice(-10) || '9426845625'}<br />
                Kitchen Address: 150 Feet Ring Road, Near Indira Circle, Rajkot, Gujarat - 360005
              </p>
              <div className="pt-2 text-[11px] text-[#21191A]/70 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#D6B77A]" />
                <span>Dispatch Mode: {orderData.deliveryType?.replace('_', ' ').toUpperCase()}</span>
              </div>
            </div>
          </div>

          {/* Itemized Snacks Table */}
          <div className="space-y-4 pt-4 border-t border-[#D6B77A]/20">
            <h3 className="font-heading font-black text-lg text-[#50000D] uppercase tracking-tight">
              Consignment Items ({orderData.orderItems?.length || 0})
            </h3>

            <div className="divide-y divide-[#D6B77A]/20 border border-[#D6B77A]/30 rounded-2xl overflow-hidden bg-white">
              {orderData.orderItems?.map((item, idx) => (
                <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.imageUrl || '/images/snacks/tikha-gathiya.jpg'}
                      alt=""
                      className="w-12 h-12 rounded-xl object-cover border border-[#D6B77A]/30 shrink-0"
                    />
                    <div>
                      <span className="font-heading font-bold text-[#21191A] text-sm block">
                        {item.name}
                      </span>
                      <span className="text-[11px] font-mono text-[#21191A]/60">
                        Weight Pack: {item.weightLabel} • ₹{item.pricePerKg}/kg
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 font-mono text-xs">
                    <span className="text-[#21191A]/70">
                      Qty: <strong>{item.quantity}</strong> × ₹{item.calculatedUnitPrice}
                    </span>
                    <span className="font-heading font-black text-sm text-[#790B13]">
                      ₹{item.itemSubtotal}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Bill Summary */}
            <div className="bg-[#FFF9F2] p-5 rounded-2xl border border-[#D6B77A]/30 space-y-2 text-xs font-mono max-w-sm ml-auto">
              <div className="flex justify-between text-[#21191A]/70">
                <span>Items Subtotal:</span>
                <span className="font-bold text-[#21191A]">₹{orderData.itemsSubtotal}</span>
              </div>
              {orderData.discountAmount > 0 && (
                <div className="flex justify-between text-[#790B13] font-bold">
                  <span>Coupon Discount:</span>
                  <span>-₹{orderData.discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between text-[#21191A]/70">
                <span>Delivery Charges:</span>
                <span className="font-bold text-[#21191A]">
                  {orderData.deliveryFee === 0 ? 'FREE' : `₹${orderData.deliveryFee}`}
                </span>
              </div>
              <div className="pt-2 border-t border-[#D6B77A]/25 flex justify-between items-baseline font-heading">
                <span className="font-black text-xs uppercase text-[#21191A]">Grand Total:</span>
                <span className="font-black text-2xl text-[#790B13]">₹{orderData.totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#D6B77A]/20">
            <a
              href={`http://localhost:5000/api/orders/${orderData._id}/invoice`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#50000D] hover:text-[#790B13] border border-[#D6B77A]/40 px-5 py-2.5 rounded-full hover:bg-[#FFF0DC] transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Tax Invoice</span>
            </a>

            <Link
              to="/snacks"
              className="inline-flex items-center gap-2 bg-[#50000D] hover:bg-[#790B13] text-[#FFF0DC] px-6 py-3 rounded-full font-heading font-black text-xs uppercase tracking-wider transition-all shadow-md"
            >
              <ShoppingBag className="w-4 h-4 text-[#D6B77A]" />
              <span>Continue Shopping</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D6B77A]" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderConfirmationPage;
