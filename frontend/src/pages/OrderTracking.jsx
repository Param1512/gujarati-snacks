import React, { useState } from 'react';
import api from '../services/api';
import { Search, PackageCheck, Clock, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';

const OrderTracking = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderNumber.trim()) return;

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const res = await api.get(
        `/orders/track/${encodeURIComponent(orderNumber.trim())}?phone=${encodeURIComponent(phone.trim())}`
      );
      if (res.success) {
        setOrder(res.order);
      }
    } catch (err) {
      setError(err.message || 'Order record not found. Verify order number and phone.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { key: 'pending', label: 'Placed' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'preparing', label: 'Kitchen Preparing' },
    { key: 'packed', label: 'Packed' },
    { key: 'dispatched', label: 'Dispatched' },
    { key: 'delivered', label: 'Delivered' },
  ];

  const currentStepIdx = order ? steps.findIndex((s) => s.key === order.orderStatus) : -1;

  return (
    <div className="min-h-screen bg-[#FFF9F2] py-12 sm:py-20 text-[#21191A] font-sans selection:bg-[#790B13] selection:text-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF0DC] border border-[#D6B77A]/40 text-[#790B13] text-xs font-mono uppercase tracking-widest shadow-xs">
            <PackageCheck className="w-3.5 h-3.5 text-[#D6B77A]" />
            <span>Live Dispatch Registry</span>
            <span className="text-[#D6B77A]">✦ Freshness in Motion</span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-5xl text-[#21191A] tracking-tight uppercase">
            Track Your <span className="font-serif italic font-normal lowercase text-[#790B13]">consignment</span>
          </h1>
          <p className="text-sm text-[#21191A]/70 font-sans leading-relaxed">
            Provide your order tracking identifier from your SMS or WhatsApp confirmation receipt to inspect real-time kitchen preparation and transit progress.
          </p>
        </div>

        {/* Tracking Input Card */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#D6B77A]/30 shadow-xl space-y-6">
          <form onSubmit={handleTrack} className="space-y-5 font-sans text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-2">
                  Order Identifier *
                </label>
                <input
                  type="text"
                  required
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="e.g. GNS-20261103-1234"
                  className="w-full bg-[#FFF9F2] border border-[#D6B77A]/30 rounded-xl px-4 py-3.5 text-xs sm:text-sm uppercase font-mono text-[#21191A] focus:outline-none focus:border-[#790B13] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-2">
                  Registered Phone (Optional)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit number"
                  className="w-full bg-[#FFF9F2] border border-[#D6B77A]/30 rounded-xl px-4 py-3.5 text-xs sm:text-sm font-mono text-[#21191A] focus:outline-none focus:border-[#790B13] transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#790B13] hover:bg-[#50000D] text-[#FFF0DC] py-4 px-6 rounded-full font-mono uppercase tracking-widest font-bold text-xs transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-[#790B13]/25 active:scale-98 group"
            >
              <Search className="w-4 h-4 text-[#D6B77A]" />
              <span>{loading ? 'Locating Record...' : 'Query Dispatch Status'}</span>
              <ArrowRight className="w-4 h-4 text-[#D6B77A] group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {error && (
            <div className="p-4 bg-rose-50 text-rose-800 text-xs font-mono rounded-2xl border border-rose-200">
              {error}
            </div>
          )}
        </div>

        {/* Live Order Result Display */}
        {order && (
          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#D6B77A]/30 shadow-xl space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#D6B77A]/20 pb-5">
              <div>
                <span className="font-heading font-black text-xl text-[#21191A] uppercase">
                  Order #{order.orderNumber}
                </span>
                <span className="text-xs font-mono text-[#21191A]/60 block mt-1">
                  Logistics Mode: {order.deliveryType?.replace('_', ' ')}
                </span>
              </div>
              <span className="bg-[#FFF0DC] border border-[#D6B77A]/40 text-[#790B13] px-4 py-1 rounded-full font-mono font-bold uppercase text-xs">
                {order.orderStatus}
              </span>
            </div>

            {/* Stepper Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 sm:gap-3">
              {steps.map((st, i) => {
                const isDone = i <= currentStepIdx;
                const isCurrent = i === currentStepIdx;
                return (
                  <div
                    key={st.key}
                    className={`p-4 rounded-2xl text-center transition-all ${
                      isCurrent
                        ? 'bg-[#790B13] text-[#FFF0DC] shadow-md ring-2 ring-[#790B13]/30 font-bold'
                        : isDone
                        ? 'bg-[#FFF0DC] text-[#790B13] border border-[#D6B77A]/40 shadow-xs font-bold'
                        : 'bg-[#FFF9F2] text-[#21191A]/40 border border-[#D6B77A]/20'
                    }`}
                  >
                    <span className="text-xs font-mono block mb-1">
                      {isDone ? '✓' : `0${i + 1}`}
                    </span>
                    <span className="font-heading text-xs uppercase tracking-tight block">
                      {st.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Item Summaries */}
            <div className="pt-4 border-t border-[#D6B77A]/20 space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-[#790B13] font-bold block">
                Parcel Consignment
              </span>
              <div className="space-y-2 bg-[#FFF9F2] p-5 rounded-2xl border border-[#D6B77A]/30">
                {order.orderItems?.map((it, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs text-[#21191A]">
                    <span>
                      <strong className="font-heading font-black uppercase text-[#21191A]">{it.name}</strong> ({it.weightLabel}) × {it.quantity}
                    </span>
                    <span className="font-heading font-black text-[#790B13]">₹{it.itemSubtotal}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;
