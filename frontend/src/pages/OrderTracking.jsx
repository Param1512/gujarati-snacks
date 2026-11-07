import React, { useState } from 'react';
import api from '../services/api';
import { Search, PackageCheck, Clock, CheckCircle2 } from 'lucide-react';

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
    <div className="min-h-screen bg-[#FAF7F2] py-10 sm:py-16 text-[#000000]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#14382B] text-[#000000] text-xs font-bold shadow-xs">
            <PackageCheck className="w-3.5 h-3.5 text-[#C84B20]" />
            <span>Live Dispatch Tracking</span>
            <span className="font-script text-base text-[#C84B20]">Freshness on the way ✦</span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-5xl text-[#000000] tracking-tight">
            Track Your Snack Parcel
          </h1>
          <p className="text-sm sm:text-base text-[#555555] font-sans leading-relaxed">
            Provide your order tracking identifier from your SMS or WhatsApp confirmation receipt to inspect real-time kitchen and transit progress.
          </p>
        </div>

        {/* Tracking Input Card */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#EAE3D9] shadow-sm space-y-6">
          <form onSubmit={handleTrack} className="space-y-4 font-sans text-xs sm:text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#555555] mb-1.5">
                  Order Identifier *
                </label>
                <input
                  type="text"
                  required
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="e.g. GNS-20261103-1234"
                  className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-2xl px-4 py-3 text-xs sm:text-sm uppercase font-mono text-[#000000] focus:outline-none focus:border-[#000000] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#555555] mb-1.5">
                  Registered Phone (Optional)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit number"
                  className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-2xl px-4 py-3 text-xs sm:text-sm font-mono text-[#000000] focus:outline-none focus:border-[#000000] transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C84B20] hover:bg-[#A33A16] text-white py-3.5 px-6 rounded-full font-bold text-xs sm:text-sm transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 shadow-md shadow-[#C84B20]/25 active:scale-98"
            >
              <Search className="w-4 h-4" />
              <span>{loading ? 'Locating Record...' : 'Query Dispatch Status →'}</span>
            </button>
          </form>

          {error && (
            <div className="p-4 bg-rose-50 text-rose-800 text-xs sm:text-sm rounded-2xl border border-rose-200">
              {error}
            </div>
          )}
        </div>

        {/* Live Order Result Display */}
        {order && (
          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#EAE3D9] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#EAE3D9] pb-4">
              <div>
                <span className="font-heading font-black text-lg sm:text-xl text-[#000000]">
                  Order #{order.orderNumber}
                </span>
                <span className="text-xs text-[#555555] block mt-0.5 font-medium">
                  Dispatch Type: {order.deliveryType?.replace('_', ' ')}
                </span>
              </div>
              <span className="bg-[#14382B] text-[#000000] px-3.5 py-1 rounded-full font-black uppercase text-xs">
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
                    className={`p-3.5 rounded-2xl text-center transition-all ${
                      isCurrent
                        ? 'bg-[#C84B20] text-white shadow-sm ring-2 ring-[#C84B20]/20 font-bold'
                        : isDone
                        ? 'bg-[#000000] text-[#14382B] shadow-xs font-bold'
                        : 'bg-[#FAF7F2] text-[#555555] opacity-60 border border-[#EAE3D9]'
                    }`}
                  >
                    <span className="text-xs font-bold block mb-0.5">
                      {isDone ? '✓' : `0${i + 1}`}
                    </span>
                    <span className="font-semibold text-xs leading-tight block">
                      {st.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Item Summaries */}
            <div className="pt-4 border-t border-[#EAE3D9] space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#555555] block">
                Parcel Contents
              </span>
              <div className="space-y-2 bg-[#FAF7F2] p-4 rounded-2xl border border-[#EAE3D9]">
                {order.orderItems?.map((it, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs sm:text-sm text-[#000000]">
                    <span>
                      <strong className="text-[#000000]">{it.name}</strong> ({it.weightLabel}) × {it.quantity}
                    </span>
                    <span className="font-bold text-[#000000]">₹{it.itemSubtotal}</span>
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
