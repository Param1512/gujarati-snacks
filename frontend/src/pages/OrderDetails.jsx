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
      <div className="min-h-screen bg-[#FAF7F2] py-32 text-center">
        <div className="w-10 h-10 border-3 border-[#000000] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-bold text-[#555555]">Loading Order Dossier...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-[#EAE3D9] text-center shadow-sm space-y-4">
          <h2 className="font-heading font-black text-2xl text-[#000000]">Order Not Found</h2>
          <p className="text-xs sm:text-sm text-[#555555] font-sans">Could not retrieve order record from database.</p>
          <div className="pt-2">
            <Link to="/my-orders" className="bg-[#C84B20] hover:bg-[#A33A16] text-white text-xs font-semibold px-6 py-3 rounded-full inline-block shadow-md shadow-[#C84B20]/25">
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
    <div className="min-h-screen bg-[#FAF7F2] py-10 sm:py-16 text-[#000000]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-[#EAE3D9] pb-6">
          <div>
            <Link
              to="/my-orders"
              className="text-xs font-semibold text-[#555555] hover:text-[#000000] flex items-center gap-1.5 mb-2.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Orders Log
            </Link>
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#14382B] text-[#000000] text-xs font-bold mb-2 shadow-xs">
              <Sparkles className="w-3 h-3 text-[#C84B20]" />
              <span>Dispatch Record</span>
            </div>
            <h1 className="font-heading font-black text-3xl sm:text-4xl text-[#000000] tracking-tight">
              Order #{order.orderNumber}
            </h1>
            <p className="text-xs text-[#555555] font-medium mt-1">
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

          <div className="flex items-center gap-2.5">
            <a
              href={`/api/orders/${order._id}/invoice`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border border-[#EAE3D9] hover:border-[#000000] text-[#000000] px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs hover:bg-[#FAF7F2]"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Tax Invoice</span>
            </a>

            {!['dispatched', 'delivered', 'cancelled'].includes(order.orderStatus) && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="border border-rose-200 hover:border-rose-400 bg-rose-50 text-rose-700 px-4 py-2 rounded-full text-xs font-semibold cursor-pointer transition-colors"
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>

        {cancelMessage && (
          <div className="p-4 bg-rose-50 text-rose-800 text-xs sm:text-sm rounded-2xl border border-rose-200 font-medium">
            {cancelMessage}
          </div>
        )}

        {/* Visual Tracking Progress Bar */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EAE3D9] space-y-6 shadow-sm">
          <h2 className="font-heading font-black text-base text-[#000000]">
            Live Fulfillment Timeline
          </h2>

          {isCancelled ? (
            <div className="p-5 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs sm:text-sm flex items-center gap-3">
              <XCircle className="w-6 h-6 shrink-0" />
              <div>
                <strong className="block font-bold">Order Cancelled</strong>
                <span className="text-[#555555] block mt-0.5 font-sans">
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

              {/* Tracking History Log */}
              {order.trackingHistory?.length > 0 && (
                <div className="pt-4 border-t border-[#EAE3D9] space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#555555] block">
                    Kitchen Dispatch Updates
                  </span>
                  <div className="space-y-1.5 text-xs">
                    {order.trackingHistory.slice().reverse().map((tr, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs">
                        <span className="text-[#555555] shrink-0 font-mono">
                          {new Date(tr.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <strong className="text-[#000000]">{tr.title}</strong>
                        <span className="text-[#555555]">— {tr.description}</span>
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
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-[#EAE3D9] space-y-4 shadow-sm">
            <h2 className="font-heading font-black text-base text-[#000000] border-b border-[#EAE3D9] pb-3">
              Ordered Snacks ({order.orderItems.length})
            </h2>

            <div className="space-y-3">
              {order.orderItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3.5 bg-[#FAF7F2] rounded-2xl border border-[#EAE3D9] text-xs sm:text-sm"
                >
                  <div className="flex items-center gap-3.5">
                    <img
                      src={item.imageUrl || '/images/snacks/tikha-gathiya.jpg'}
                      alt={item.name}
                      className="w-14 h-14 rounded-xl object-cover border border-[#EAE3D9] shrink-0"
                    />
                    <div>
                      <h3 className="font-heading font-bold text-xs sm:text-sm text-[#000000]">{item.name}</h3>
                      <span className="text-[#555555] text-xs block mt-0.5">
                        Pack: {item.weightLabel} (₹{item.pricePerKg}/kg)
                      </span>
                      <span className="text-[#555555] text-xs block">
                        Quantity: {item.quantity} × ₹{item.calculatedUnitPrice}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-heading font-black text-sm sm:text-base text-[#000000] block">
                      ₹{item.itemSubtotal}
                    </span>
                    <span className="text-xs text-[#555555] block font-medium">
                      {(item.totalGrams / 1000).toFixed(2)} kg
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping & Payment Meta */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-[#EAE3D9] space-y-3 text-xs sm:text-sm shadow-sm">
              <h2 className="font-heading font-bold text-sm text-[#000000] border-b border-[#EAE3D9] pb-2">
                Delivery Details
              </h2>
              <p className="text-[#000000] leading-relaxed font-sans">
                <strong className="text-[#000000]">{order.shippingAddress.fullName}</strong><br />
                {order.shippingAddress.addressLine1}
                {order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ''}<br />
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}<br />
                <span className="text-[#555555] mt-1 block">Phone: {order.shippingAddress.phone}</span>
              </p>
              <div className="pt-2 border-t border-[#EAE3D9] text-xs text-[#555555]">
                Mode: <strong className="text-[#000000]">{order.deliveryType?.replace('_', ' ')}</strong>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#EAE3D9] space-y-3 text-xs sm:text-sm shadow-sm">
              <h2 className="font-heading font-bold text-sm text-[#000000] border-b border-[#EAE3D9] pb-2">
                Financial Summary
              </h2>
              <div className="flex justify-between text-[#555555]">
                <span>Subtotal:</span>
                <span className="font-semibold text-[#000000]">₹{order.itemsSubtotal}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-[#C84B20]">
                  <span>Discount:</span>
                  <span className="font-semibold">-₹{order.discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between text-[#555555]">
                <span>Delivery:</span>
                <span className="font-semibold text-[#000000]">
                  {order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}
                </span>
              </div>
              <div className="pt-3 border-t border-[#EAE3D9] flex justify-between items-baseline font-bold text-sm sm:text-base">
                <span className="text-[#000000]">Total:</span>
                <span className="font-heading font-black text-xl text-[#000000]">₹{order.totalAmount}</span>
              </div>
              <div className="pt-2 border-t border-[#EAE3D9] flex justify-between text-xs text-[#555555]">
                <span>Payment Mode:</span>
                <strong className="text-[#000000]">{order.paymentMethod}</strong>
              </div>
              <div className="flex justify-between text-xs text-[#555555]">
                <span>Payment Status:</span>
                <span className="font-bold text-[#000000] uppercase">{order.paymentStatus}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cancel Order Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-[#000000]/60 backdrop-blur-xs" onClick={() => setShowCancelModal(false)} />
            <div className="relative bg-[#FAF7F2] rounded-3xl border border-[#EAE3D9] max-w-md w-full p-6 sm:p-8 shadow-2xl z-10 space-y-4">
              <h3 className="font-heading font-black text-xl text-[#000000]">
                Cancel Order #{order.orderNumber}?
              </h3>
              <p className="text-xs sm:text-sm text-[#555555] font-sans">
                Cancelling this order will return reserved snack inventory back to our kitchen stock.
              </p>
              <form onSubmit={handleCancelOrder} className="space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block text-xs font-semibold text-[#555555] mb-1.5">
                    Reason for Cancellation
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="e.g. Changed required weight or address..."
                    className="w-full bg-white border border-[#EAE3D9] rounded-2xl p-3 text-xs sm:text-sm text-[#000000] focus:outline-none focus:border-[#000000]"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={cancelling}
                    className="flex-1 bg-rose-700 hover:bg-rose-800 text-white py-3 rounded-full text-xs font-semibold cursor-pointer shadow-sm"
                  >
                    {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCancelModal(false)}
                    className="px-5 py-3 border border-[#EAE3D9] text-[#555555] rounded-full text-xs font-semibold hover:bg-white cursor-pointer"
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
