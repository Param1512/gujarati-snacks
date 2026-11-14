import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import {
  ArrowLeft,
  FileText,
  Save,
  Sparkles,
} from 'lucide-react';

const AdminOrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Editable fields
  const [orderStatus, setOrderStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/orders/${id}`);
      if (res.success) {
        setOrder(res.order);
        setOrderStatus(res.order.orderStatus);
        setPaymentStatus(res.order.paymentStatus);
        setAdminNotes(res.order.adminNotes || '');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const res = await api.put(`/orders/${order._id}/status`, {
        status: orderStatus,
        paymentStatus,
        adminNotes,
      });
      if (res.success) {
        setMessage('Order updated successfully!');
        fetchOrder();
      }
    } catch (err) {
      setMessage('Error updating: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-xs text-[#790B13] font-mono font-bold uppercase tracking-widest">
        Loading order details...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20 text-xs font-sans">
        <p className="text-[#21191A]/60 mb-4">Order record not found.</p>
        <Link to="/admin/orders" className="text-[#790B13] font-mono font-bold uppercase tracking-wider underline">
          Return to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-[#21191A] font-sans">
      {/* Top Bar */}
      <div className="border-b border-[#D6B77A]/20 pb-6 flex items-center justify-between">
        <Link
          to="/admin/orders"
          className="text-xs font-mono uppercase tracking-widest text-[#790B13] hover:underline flex items-center gap-2 font-bold"
        >
          <ArrowLeft className="w-4 h-4 text-[#D6B77A]" /> Return to Orders List
        </Link>
        <a
          href={`/api/orders/${order._id}/invoice`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white hover:bg-[#FFF0DC]/40 border border-[#D6B77A]/40 text-[#21191A] px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider font-bold flex items-center gap-2 transition-colors shadow-xs"
        >
          <FileText className="w-4 h-4 text-[#790B13]" />
          <span>Print Tax Invoice</span>
        </a>
      </div>

      <div className="bg-white p-6 sm:p-12 rounded-3xl border border-[#D6B77A]/30 shadow-xl space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 border-b border-[#D6B77A]/20 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF0DC] border border-[#D6B77A]/40 text-[#790B13] text-xs font-mono uppercase tracking-widest mb-2 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#D6B77A]" />
              <span>Fulfillment Dossier</span>
            </div>
            <h1 className="font-heading font-black text-2xl sm:text-4xl text-[#21191A] uppercase tracking-tight">
              Order {order.orderNumber}
            </h1>
          </div>
          <div className="text-xs text-[#21191A]/60 font-mono">
            Placed on {new Date(order.createdAt).toLocaleString()}
          </div>
        </div>

        {message && (
          <div className="p-4 bg-[#FFF0DC] text-[#790B13] text-xs rounded-2xl border border-[#D6B77A]/40 font-mono font-bold">
            {message}
          </div>
        )}

        {/* Status Update Form */}
        <form onSubmit={handleUpdate} className="bg-[#FFF9F2] p-6 sm:p-8 rounded-2xl border border-[#D6B77A]/30 space-y-5 text-xs sm:text-sm font-sans">
          <h2 className="font-heading font-black text-sm uppercase tracking-wider text-[#21191A]">
            Update Kitchen & Dispatch Status
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-2">
                Order Status
              </label>
              <select
                value={orderStatus}
                onChange={(e) => setOrderStatus(e.target.value)}
                className="w-full bg-white border border-[#D6B77A]/30 rounded-xl px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider text-[#21191A] focus:outline-none focus:border-[#790B13] cursor-pointer"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="preparing">Kitchen Preparing</option>
                <option value="packed">Sealed & Packed</option>
                <option value="dispatched">Dispatched</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-2">
                Payment Status
              </label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="w-full bg-white border border-[#D6B77A]/30 rounded-xl px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider text-[#21191A] focus:outline-none focus:border-[#790B13] cursor-pointer"
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-2">
              Internal Admin Notes
            </label>
            <textarea
              rows={2}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="e.g. Verified with patron, custom packaging added."
              className="w-full bg-white border border-[#D6B77A]/30 rounded-xl p-3 text-xs text-[#21191A] focus:outline-none focus:border-[#790B13]"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-[#790B13] hover:bg-[#50000D] text-[#FFF0DC] px-8 py-3 rounded-full font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all shadow-md shadow-[#790B13]/25 disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5 text-[#D6B77A]" />
            <span>{saving ? 'Updating...' : 'Commit Status Update'}</span>
          </button>
        </form>

        {/* Customer & Shipping Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs sm:text-sm font-sans">
          <div className="p-6 bg-[#FFF9F2] rounded-2xl border border-[#D6B77A]/30 space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-[#790B13] font-bold block">
              Patron Profile
            </span>
            <div className="font-heading font-black text-base text-[#21191A] uppercase">
              {order.shippingAddress?.fullName}
            </div>
            <div className="text-[#21191A]/70 space-y-1 font-mono text-xs">
              <div>Email: {order.customer?.email || 'N/A'}</div>
              <div>Phone: {order.shippingAddress?.phone}</div>
            </div>
          </div>

          <div className="p-6 bg-[#FFF9F2] rounded-2xl border border-[#D6B77A]/30 space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-[#790B13] font-bold block">
              Destination ({order.deliveryType?.replace('_', ' ').toUpperCase()})
            </span>
            <div className="text-[#21191A] leading-relaxed font-sans text-xs">
              {order.shippingAddress?.addressLine1}
              {order.shippingAddress?.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ''}<br />
              {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
            </div>
          </div>
        </div>

        {/* Ordered Snacks List */}
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-[#D6B77A]/20 pb-3">
            <h3 className="font-heading font-black text-sm uppercase tracking-wider text-[#21191A]">
              Manifest Items ({order.orderItems.length})
            </h3>
            <span className="text-xs font-mono text-[#21191A]/60">
              Gross Consignment: {(order.totalWeightGrams / 1000).toFixed(2)} kg
            </span>
          </div>

          <div className="divide-y divide-[#D6B77A]/15 border border-[#D6B77A]/30 rounded-2xl bg-white overflow-hidden text-xs sm:text-sm font-sans">
            {order.orderItems.map((it, idx) => (
              <div key={idx} className="p-4 flex justify-between items-center hover:bg-[#FFF9F2] transition-colors">
                <div>
                  <span className="font-heading font-black text-xs uppercase text-[#21191A] block">{it.name}</span>
                  <span className="text-[#21191A]/60 text-xs font-mono">
                    Pack: {it.weightLabel} (₹{it.pricePerKg}/kg) • Qty: {it.quantity}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-heading font-black text-sm text-[#790B13] block">₹{it.itemSubtotal}</span>
                  <span className="text-xs text-[#21191A]/60 font-mono">
                    {(it.totalGrams / 1000).toFixed(2)} kg
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Totals */}
          <div className="p-5 bg-[#FFF0DC] rounded-2xl border border-[#D6B77A]/40 text-xs font-mono space-y-2 max-w-xs ml-auto">
            <div className="flex justify-between text-[#21191A]/70">
              <span>Items Total</span>
              <span>₹{order.itemsPrice}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-[#790B13] font-bold">
                <span>Discount</span>
                <span>-₹{order.discountAmount}</span>
              </div>
            )}
            <div className="flex justify-between text-[#21191A]/70">
              <span>Delivery Fee</span>
              <span>₹{order.shippingPrice}</span>
            </div>
            <div className="flex justify-between font-heading font-black text-base text-[#790B13] pt-2 border-t border-[#D6B77A]/30">
              <span className="text-[#21191A]">Final Total</span>
              <span>₹{order.totalAmount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;
