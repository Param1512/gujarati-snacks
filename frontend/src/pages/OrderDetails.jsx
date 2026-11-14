import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { FileText, XCircle, ArrowLeft, Check, Sparkles } from 'lucide-react';

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelMessage, setCancelMessage] = useState('');

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/orders/${orderId}`);
      if (res.success) setOrder(res.order);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const handleCancelOrder = async (e) => {
    e.preventDefault();
    setCancelling(true);
    setCancelMessage('');
    try {
      const res = await api.post(`/orders/${order._id}/cancel`, {
        reason: cancelReason || 'Cancelled by customer',
      });
      if (res.success) {
        setCancelMessage('Order has been cancelled successfully.');
        setShowCancelModal(false);
        fetchOrder();
      }
    } catch (err) {
      setCancelMessage(err.message || 'Could not cancel order');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF9F2] py-32 text-center font-sans">
        <div className="w-10 h-10 border-2 border-[#790B13] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-mono uppercase tracking-widest text-[#790B13]">Loading Order Dossier...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#FFF9F2] flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-white p-10 rounded-3xl border border-[#D6B77A]/30 text-center shadow-lg space-y-5">
          <h2 className="font-heading font-black text-2xl uppercase tracking-tight text-[#21191A]">Order Not Found</h2>
          <p className="text-xs sm:text-sm text-[#21191A]/70 font-sans">Could not retrieve order record from the archive.</p>
          <div className="pt-2">
            <Link to="/my-orders" className="bg-[#790B13] hover:bg-[#50000D] text-[#FFF0DC] text-xs font-mono uppercase tracking-widest font-bold px-8 py-4 rounded-full inline-block shadow-lg shadow-[#790B13]/20">
              Back to Orders →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Progress Bar Steps
  const steps = [
    { key: 'pending', label: 'Placed' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'preparing', label: 'Kitchen Preparing' },
    { key: 'packed', label: 'Sealed & Packed' },
    { key: 'dispatched', label: 'Dispatched' },
    { key: 'delivered', label: 'Delivered' },
  ];

  const currentStepIdx = steps.findIndex((s) => s.key === order.orderStatus);
  const isCancelled = order.orderStatus === 'cancelled';

  return (
    <div className="min-h-screen bg-[#FFF9F2] py-12 sm:py-20 text-[#21191A] font-sans selection:bg-[#790B13] selection:text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-[#D6B77A]/20 pb-8">
          <div>
            <Link
              to="/my-orders"
              className="text-xs font-mono uppercase tracking-widest text-[#790B13] hover:underline flex items-center gap-1.5 mb-3 font-bold"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Orders Log
            </Link>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0DC] border border-[#D6B77A]/40 text-[#790B13] text-xs font-mono uppercase tracking-widest mb-2 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#D6B77A]" />
              <span>Dispatch Record</span>
            </div>
            <h1 className="font-heading font-black text-3xl sm:text-5xl text-[#21191A] uppercase tracking-tight">
              Order #{order.orderNumber}
            </h1>
            <p className="text-xs font-mono text-[#21191A]/60 mt-1">
              Registered on{' '}
              {new Date(order.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`/api/orders/${order._id}/invoice`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border border-[#D6B77A]/40 hover:border-[#790B13] text-[#21191A] px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider font-bold flex items-center gap-1.5 transition-colors shadow-xs hover:bg-[#FFF0DC]/40"
            >
              <FileText className="w-3.5 h-3.5 text-[#790B13]" />
              <span>Tax Invoice</span>
            </a>

            {!['dispatched', 'delivered', 'cancelled'].includes(order.orderStatus) && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="border border-rose-200 hover:border-rose-400 bg-rose-50 text-rose-800 px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider font-bold cursor-pointer transition-colors"
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>

        {cancelMessage && (
          <div className="p-4 bg-rose-50 text-rose-800 text-xs font-mono rounded-2xl border border-rose-200">
            {cancelMessage}
          </div>
        )}

        {/* Visual Tracking Progress Bar */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#D6B77A]/30 space-y-6 shadow-sm">
          <h2 className="font-heading font-black text-lg text-[#21191A] uppercase tracking-tight">
            Live Fulfillment Timeline
          </h2>

          {isCancelled ? (
            <div className="p-6 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs sm:text-sm flex items-center gap-4">
              <XCircle className="w-7 h-7 shrink-0 text-rose-700" />
              <div>
                <strong className="block font-heading font-black text-sm uppercase">Order Cancelled</strong>
                <span className="text-[#21191A]/70 block mt-1 font-sans">
                  Reason: {order.cancellationReason || 'Customer requested cancellation.'}
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
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

              {/* Tracking History Log */}
              {order.trackingHistory?.length > 0 && (
                <div className="pt-6 border-t border-[#D6B77A]/20 space-y-3">
                  <span className="text-xs font-mono uppercase tracking-widest text-[#790B13] font-bold block">
                    Kitchen Dispatch Updates
                  </span>
                  <div className="space-y-2 text-xs">
                    {order.trackingHistory.slice().reverse().map((tr, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs">
                        <span className="text-[#21191A]/60 shrink-0 font-mono">
                          {new Date(tr.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <strong className="text-[#21191A] font-bold">{tr.title}</strong>
                        <span className="text-[#21191A]/70">— {tr.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Order Line Items & Financial Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-[#D6B77A]/30 space-y-5 shadow-sm">
            <h2 className="font-heading font-black text-lg text-[#21191A] uppercase tracking-tight border-b border-[#D6B77A]/20 pb-4">
              Ordered Snacks ({order.orderItems.length})
            </h2>

            <div className="space-y-3.5">
              {order.orderItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-[#FFF9F2] rounded-2xl border border-[#D6B77A]/30 text-xs sm:text-sm"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.imageUrl || '/images/snacks/tikha-gathiya.jpg'}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover border border-[#D6B77A]/30 shrink-0"
                    />
                    <div>
                      <h3 className="font-heading font-black text-sm uppercase text-[#21191A]">{item.name}</h3>
                      <span className="text-[#21191A]/60 text-xs font-mono block mt-1">
                        Pack: {item.weightLabel} (₹{item.pricePerKg}/kg)
                      </span>
                      <span className="text-[#21191A]/60 text-xs font-mono block">
                        Quantity: {item.quantity} × ₹{item.calculatedUnitPrice}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-heading font-black text-base text-[#790B13] block">
                      ₹{item.itemSubtotal}
                    </span>
                    <span className="text-xs font-mono text-[#21191A]/60 block mt-0.5">
                      {(item.totalGrams / 1000).toFixed(2)} kg
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping & Payment Meta */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#D6B77A]/30 space-y-3.5 text-xs shadow-sm">
              <h2 className="font-heading font-black text-sm uppercase text-[#21191A] border-b border-[#D6B77A]/20 pb-3">
                Delivery Details
              </h2>
              <p className="text-[#21191A] leading-relaxed font-sans">
                <strong className="text-[#21191A] font-bold">{order.shippingAddress.fullName}</strong><br />
                {order.shippingAddress.addressLine1}
                {order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ''}<br />
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}<br />
                <span className="text-[#21191A]/70 mt-1 block font-mono">Phone: {order.shippingAddress.phone}</span>
              </p>
              <div className="pt-3 border-t border-[#D6B77A]/20 text-xs text-[#21191A]/70 font-mono">
                Logistics Mode: <strong className="text-[#21191A] uppercase">{order.deliveryType?.replace('_', ' ')}</strong>
              </div>
            </div>

            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#D6B77A]/30 space-y-3.5 text-xs font-mono shadow-sm">
              <h2 className="font-heading font-black text-sm uppercase text-[#21191A] border-b border-[#D6B77A]/20 pb-3">
                Financial Summary
              </h2>
              <div className="flex justify-between text-[#21191A]/70">
                <span>Subtotal</span>
                <span className="font-bold text-[#21191A]">₹{order.itemsSubtotal}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-[#790B13] font-bold">
                  <span>Discount</span>
                  <span>-₹{order.discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between text-[#21191A]/70">
                <span>Delivery</span>
                <span className="font-bold text-[#21191A]">
                  {order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}
                </span>
              </div>
              <div className="pt-4 border-t border-[#D6B77A]/20 flex justify-between items-baseline font-heading">
                <span className="font-black text-sm uppercase text-[#21191A]">Total:</span>
                <span className="font-black text-2xl text-[#790B13]">₹{order.totalAmount}</span>
              </div>
              <div className="pt-3 border-t border-[#D6B77A]/20 flex justify-between text-xs text-[#21191A]/70">
                <span>Payment Mode:</span>
                <strong className="text-[#21191A] uppercase">{order.paymentMethod}</strong>
              </div>
              <div className="flex justify-between text-xs text-[#21191A]/70">
                <span>Payment Status:</span>
                <span className="font-bold text-[#790B13] uppercase">{order.paymentStatus}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cancel Order Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-[#21191A]/70 backdrop-blur-xs" onClick={() => setShowCancelModal(false)} />
            <div className="relative bg-[#FFF9F2] rounded-3xl border border-[#D6B77A]/40 max-w-md w-full p-6 sm:p-8 shadow-2xl z-10 space-y-5">
              <h3 className="font-heading font-black text-xl text-[#21191A] uppercase tracking-tight">
                Cancel Order #{order.orderNumber}?
              </h3>
              <p className="text-xs text-[#21191A]/70 font-sans leading-relaxed">
                Cancelling this order will return reserved snack inventory back to our kitchen stock.
              </p>
              <form onSubmit={handleCancelOrder} className="space-y-4 text-xs font-sans">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-1.5">
                    Reason for Cancellation
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="e.g. Changed required weight or address..."
                    className="w-full bg-white border border-[#D6B77A]/30 rounded-xl p-3.5 text-xs text-[#21191A] focus:outline-none focus:border-[#790B13]"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={cancelling}
                    className="flex-1 bg-rose-700 hover:bg-rose-800 text-white py-3.5 rounded-full text-xs font-mono uppercase tracking-wider font-bold cursor-pointer shadow-md"
                  >
                    {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCancelModal(false)}
                    className="px-6 py-3.5 border border-[#D6B77A]/30 text-[#21191A]/70 rounded-full text-xs font-mono uppercase tracking-wider hover:bg-white cursor-pointer"
                  >
                    Back
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
