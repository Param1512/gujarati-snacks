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
      <div className="py-24 text-center text-xs text-[#555555] font-heading font-bold uppercase tracking-wider">
        Loading order details...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20 text-xs font-sans">
        <p className="text-[#555555] mb-4">Order record not found.</p>
        <Link to="/admin/orders" className="text-[#000000] font-heading font-bold uppercase tracking-wider underline">
          Return to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-[#000000]">
      {/* Top Bar */}
      <div className="border-b border-[#EAE3D9] pb-6 flex items-center justify-between">
        <Link
          to="/admin/orders"
          className="text-xs font-bold uppercase tracking-wider text-[#000000] hover:text-[#C84B20] flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Orders List
        </Link>
        <a
          href={`/api/orders/${order._id}/invoice`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white hover:bg-[#FAF7F2] border border-[#EAE3D9] text-[#000000] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors shadow-xs"
        >
          <FileText className="w-4 h-4 text-[#C84B20]" />
          <span>Print Tax Invoice</span>
        </a>
      </div>

      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#EAE3D9] shadow-sm space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 border-b border-[#EAE3D9] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#14382B] text-[#000000] text-xs font-bold mb-2 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#C84B20]" />
              <span>Fulfillment Dossier</span>
            </div>
            <h1 className="font-heading font-black text-2xl sm:text-3xl text-[#000000] tracking-tight">
              Order {order.orderNumber}
            </h1>
          </div>
          <div className="text-xs text-[#555555] font-mono">
            Placed on {new Date(order.createdAt).toLocaleString()}
          </div>
        </div>

        {message && (
          <div className="p-4 bg-[#EBF4EF] text-[#000000] text-xs rounded-2xl border border-[#14382B] font-sans font-medium">
            {message}
          </div>
        )}

        {/* Status Update Form */}
        <form onSubmit={handleUpdate} className="bg-[#FAF7F2] p-6 sm:p-8 rounded-2xl border border-[#EAE3D9] space-y-5 text-xs sm:text-sm font-sans">
          <h2 className="font-heading font-black text-sm uppercase tracking-wider text-[#000000]">
            Update Kitchen & Dispatch Status
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#000000] mb-2">
                Order Status
              </label>
              <select
                value={orderStatus}
                onChange={(e) => setOrderStatus(e.target.value)}
                className="w-full bg-white border border-[#EAE3D9] rounded-xl px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-[#000000] focus:outline-none focus:border-[#000000]"
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
              <label className="block text-xs font-bold uppercase tracking-wider text-[#000000] mb-2">
                Payment Status
              </label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="w-full bg-white border border-[#EAE3D9] rounded-xl px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-[#000000] focus:outline-none focus:border-[#000000]"
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#000000] mb-2">
              Internal Admin Notes
            </label>
            <textarea
              rows={2}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="e.g. Verified with patron, custom packing added."
              className="w-full bg-white border border-[#EAE3D9] rounded-xl px-3.5 py-2 text-xs text-[#000000] focus:outline-none focus:border-[#000000]"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-[#000000] hover:bg-[#C84B20] text-white px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors shadow-sm disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5 text-[#14382B]" />
            <span>{saving ? 'Updating...' : 'Commit Status Update'}</span>
          </button>
        </form>

        {/* Customer & Shipping Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs sm:text-sm font-sans">
          <div className="p-6 bg-[#FAF7F2] rounded-2xl border border-[#EAE3D9] space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#555555] block">
              Patron Profile
            </span>
            <div className="font-heading font-black text-base text-[#000000]">
              {order.shippingAddress?.fullName}
            </div>
            <div className="text-[#555555] space-y-1">
              <div>Email: {order.customer?.email || 'N/A'}</div>
              <div>Phone: {order.shippingAddress?.phone}</div>
            </div>
          </div>

          <div className="p-6 bg-[#FAF7F2] rounded-2xl border border-[#EAE3D9] space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#555555] block">
              Destination ({order.deliveryType?.replace('_', ' ').toUpperCase()})
            </span>
            <div className="text-[#000000] leading-relaxed">
              {order.shippingAddress?.addressLine1}
              {order.shippingAddress?.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ''}<br />
              {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
            </div>
          </div>
        </div>

        {/* Ordered Snacks List */}
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-[#EAE3D9] pb-2">
            <h3 className="font-heading font-black text-sm uppercase tracking-wider text-[#000000]">
              Manifest Items ({order.orderItems.length})
            </h3>
            <span className="text-xs font-mono text-[#555555]">
              Gross: {(order.totalWeightGrams / 1000).toFixed(2)} kg
            </span>
          </div>

          <div className="divide-y divide-[#E5E5E0] border border-[#EAE3D9] rounded-2xl bg-white overflow-hidden text-xs sm:text-sm font-sans">
            {order.orderItems.map((it, idx) => (
              <div key={idx} className="p-4 flex justify-between items-center hover:bg-[#FAF7F2] transition-colors">
                <div>
                  <span className="font-semibold text-sm text-[#000000] block">{it.name}</span>
                  <span className="text-[#555555] text-xs font-mono">
                    Pack: {it.weightLabel} (₹{it.pricePerKg}/kg) • Qty: {it.quantity}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-heading font-black text-sm text-[#000000] block">₹{it.itemSubtotal}</span>
                  <span className="text-xs text-[#555555] font-mono">
                    {(it.totalGrams / 1000).toFixed(2)} kg
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Totals */}
          <div className="p-5 bg-[#FAF7F2] rounded-2xl border border-[#EAE3D9] text-xs font-mono space-y-2 max-w-xs ml-auto">
            <div className="flex justify-between text-[#555555]">
              <span>Items Total</span>
              <span>₹{order.itemsPrice}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-[#C84B20] font-bold">
                <span>Discount</span>
                <span>-₹{order.discountAmount}</span>
              </div>
            )}
            <div className="flex justify-between text-[#555555]">
              <span>Delivery Fee</span>
              <span>₹{order.shippingPrice}</span>
            </div>
            <div className="flex justify-between font-heading font-black text-base text-[#000000] pt-2 border-t border-[#EAE3D9]">
              <span>Final Total</span>
              <span>₹{order.totalAmount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;
