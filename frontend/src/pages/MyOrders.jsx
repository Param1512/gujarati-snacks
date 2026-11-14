import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { Package, RotateCcw, FileText, ArrowRight, Sparkles } from 'lucide-react';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get('/orders/my-orders')
      .then((res) => {
        if (res.success) setOrders(res.orders);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleReorder = async (orderId) => {
    try {
      const res = await api.get(`/orders/reorder/${orderId}`);
      if (res.success && res.items?.length > 0) {
        res.items.forEach((item) => {
          addToCart(
            {
              _id: item.product,
              name: item.name,
              slug: item.slug,
              pricePerKg: item.pricePerKg,
              images: [{ url: item.imageUrl }],
            },
            item.weightGrams,
            item.quantity
          );
        });
        navigate('/cart');
      }
    } catch (err) {
      alert('Could not reorder: ' + err.message);
    }
  };

  const getStatusBadge = (status) => {
    const isDelivered = status?.toLowerCase() === 'delivered';
    const isProcessing = status?.toLowerCase() === 'processing' || status?.toLowerCase() === 'confirmed';
    return (
      <span className={`border px-3.5 py-1 rounded-full text-xs font-mono uppercase tracking-wider font-bold ${
        isDelivered
          ? 'border-emerald-600/40 bg-emerald-50 text-emerald-800'
          : isProcessing
          ? 'border-[#D6B77A]/60 bg-[#FFF0DC] text-[#790B13]'
          : 'border-[#D6B77A]/40 bg-[#FFF9F2] text-[#21191A]'
      }`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#FFF9F2] py-12 sm:py-20 text-[#21191A] font-sans selection:bg-[#790B13] selection:text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#D6B77A]/20 pb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0DC] border border-[#D6B77A]/40 text-[#790B13] text-xs font-mono uppercase tracking-widest mb-2 shadow-xs">
              <Package className="w-3.5 h-3.5 text-[#D6B77A]" />
              <span>Patron Purchase History</span>
            </div>
            <h1 className="font-heading font-black text-3xl sm:text-5xl text-[#21191A] uppercase tracking-tight">
              My Snack <span className="font-serif italic font-normal lowercase text-[#790B13]">orders</span>
            </h1>
          </div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#790B13] bg-white border border-[#D6B77A]/40 px-5 py-2 rounded-full w-fit shadow-xs font-bold">
            {orders.length} {orders.length === 1 ? 'consignment on record' : 'consignments on record'}
          </span>
        </div>

        {loading ? (
          <div className="py-24 text-center">
            <div className="w-10 h-10 border-2 border-[#790B13] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-mono uppercase tracking-widest text-[#790B13]">Accessing Order Registry...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white p-10 sm:p-14 text-center rounded-3xl border border-[#D6B77A]/30 max-w-md mx-auto space-y-5 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#FFF0DC] text-[#790B13] flex items-center justify-center mx-auto shadow-xs border border-[#D6B77A]/40">
              <Package className="w-8 h-8" />
            </div>
            <h2 className="font-heading font-black text-2xl uppercase tracking-tight text-[#21191A]">
              No Orders on Record
            </h2>
            <p className="text-xs sm:text-sm text-[#21191A]/70 font-sans leading-relaxed">
              You have not placed any snack commissions yet. Indulge in authentic Kathiyawadi namkeen prepared fresh in pure groundnut oil.
            </p>
            <div className="pt-2">
              <Link
                to="/snacks"
                className="bg-[#790B13] hover:bg-[#50000D] text-[#FFF0DC] text-xs font-mono uppercase tracking-widest font-bold px-8 py-4 rounded-full inline-block transition-all shadow-lg shadow-[#790B13]/20 active:scale-98 cursor-pointer"
              >
                Explore Catalogue →
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white p-6 sm:p-8 rounded-3xl border border-[#D6B77A]/30 space-y-6 shadow-sm hover:border-[#790B13]/30 transition-colors"
              >
                {/* Top Meta Line */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#D6B77A]/20 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-heading font-black text-[#21191A] text-base sm:text-lg uppercase">
                      Order #{order.orderNumber}
                    </span>
                    <span className="text-xs font-mono text-[#21191A]/60">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(order.orderStatus)}
                    <span className="font-heading font-black text-lg sm:text-xl text-[#790B13]">
                      ₹{order.totalAmount}
                    </span>
                  </div>
                </div>

                {/* Items in order */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {order.orderItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3.5 bg-[#FFF9F2] p-3.5 rounded-2xl border border-[#D6B77A]/30"
                    >
                      <img
                        src={item.imageUrl || '/images/snacks/tikha-gathiya.jpg'}
                        alt=""
                        className="w-12 h-12 rounded-xl object-cover border border-[#D6B77A]/30 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="font-heading font-black text-[#21191A] block truncate text-xs sm:text-sm uppercase">
                          {item.name}
                        </span>
                        <span className="text-xs font-mono text-[#21191A]/60 block mt-0.5">
                          {item.weightLabel} × {item.quantity} (₹{item.itemSubtotal})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Actions */}
                <div className="pt-4 border-t border-[#D6B77A]/20 flex flex-wrap justify-between items-center gap-3 text-xs">
                  <div className="text-[#21191A]/70 font-sans">
                    <span>Destination: </span>
                    <strong className="text-[#21191A]">
                      {order.shippingAddress.fullName}, {order.shippingAddress.city}
                    </strong>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <a
                      href={`/api/orders/${order._id}/invoice`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 border border-[#D6B77A]/40 hover:border-[#790B13] bg-white text-[#21191A] rounded-full text-xs font-mono uppercase tracking-wider font-bold flex items-center gap-1.5 transition-colors shadow-xs hover:bg-[#FFF0DC]/40"
                      title="Print Tax Invoice"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#790B13]" />
                      <span>Invoice</span>
                    </a>

                    <button
                      onClick={() => handleReorder(order._id)}
                      className="px-4 py-2 border border-[#D6B77A]/40 hover:border-[#790B13] bg-white text-[#21191A] rounded-full text-xs font-mono uppercase tracking-wider font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs hover:bg-[#FFF0DC]/40"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-[#790B13]" />
                      <span>Reorder</span>
                    </button>

                    <Link
                      to={`/order/${order.orderNumber}`}
                      className="px-6 py-2.5 bg-[#790B13] hover:bg-[#50000D] text-[#FFF0DC] rounded-full text-xs font-mono uppercase tracking-wider font-bold flex items-center gap-1.5 transition-all shadow-md shadow-[#790B13]/20 active:scale-98 cursor-pointer group"
                    >
                      <span>Track Status</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#D6B77A] group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
