import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { Package, RotateCcw, FileText, ArrowRight } from 'lucide-react';

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
    return (
      <span className="border border-[#EAE3D9] px-3 py-1 rounded-full text-xs font-bold uppercase bg-[#14382B] text-[#000000]">
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-10 sm:py-16 text-[#000000]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#EAE3D9] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#14382B] text-[#000000] text-xs font-bold mb-2 shadow-xs">
              <Package className="w-3.5 h-3.5 text-[#C84B20]" />
              <span>Customer Order History</span>
            </div>
            <h1 className="font-heading font-black text-3xl sm:text-4xl text-[#000000] tracking-tight">
              My Snack Orders
            </h1>
          </div>
          <span className="text-xs font-bold text-[#000000] bg-white border border-[#EAE3D9] px-4 py-1.5 rounded-full w-fit">
            {orders.length} {orders.length === 1 ? 'registered order' : 'registered orders'}
          </span>
        </div>

        {loading ? (
          <div className="py-24 text-center">
            <div className="w-10 h-10 border-3 border-[#000000] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-bold text-[#555555]">Accessing Order Registry...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-[#EBF4EF] p-10 sm:p-14 text-center rounded-3xl border border-[#14382B]/60 max-w-md mx-auto space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-white text-[#555555] flex items-center justify-center mx-auto shadow-xs border border-[#EAE3D9]">
              <Package className="w-8 h-8 text-[#000000]" />
            </div>
            <h2 className="font-heading font-bold text-xl text-[#000000]">
              No Orders on Record
            </h2>
            <p className="text-xs sm:text-sm text-[#555555] font-sans leading-relaxed">
              You have not placed any snack orders yet. Order fresh homemade farsan prepared in pure Sing-Tel today.
            </p>
            <div className="pt-2">
              <Link
                to="/snacks"
                className="bg-[#C84B20] hover:bg-[#A33A16] text-white text-xs sm:text-sm font-semibold px-6 py-3 rounded-full inline-block transition-all shadow-md shadow-[#C84B20]/25 active:scale-98 cursor-pointer"
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
                className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EAE3D9] space-y-5 shadow-sm"
              >
                {/* Top Meta Line */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#EAE3D9] pb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-heading font-black text-[#000000] text-base sm:text-lg">
                      Order #{order.orderNumber}
                    </span>
                    <span className="text-xs text-[#555555] font-medium">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(order.orderStatus)}
                    <span className="font-heading font-black text-base sm:text-lg text-[#000000]">
                      ₹{order.totalAmount}
                    </span>
                  </div>
                </div>

                {/* Items in order */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {order.orderItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 bg-[#FAF7F2] p-3 rounded-2xl border border-[#EAE3D9]"
                    >
                      <img
                        src={item.imageUrl || '/images/snacks/tikha-gathiya.jpg'}
                        alt=""
                        className="w-12 h-12 rounded-xl object-cover border border-[#EAE3D9] shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="font-heading font-bold text-[#000000] block truncate text-xs sm:text-sm">
                          {item.name}
                        </span>
                        <span className="text-xs text-[#555555] block font-medium">
                          {item.weightLabel} × {item.quantity} (₹{item.itemSubtotal})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Actions */}
                <div className="pt-4 border-t border-[#EAE3D9] flex flex-wrap justify-between items-center gap-3 text-xs sm:text-sm">
                  <div className="text-[#555555]">
                    <span>Destination: </span>
                    <strong className="text-[#000000]">
                      {order.shippingAddress.fullName}, {order.shippingAddress.city}
                    </strong>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`/api/orders/${order._id}/invoice`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 border border-[#EAE3D9] hover:border-[#000000] bg-white text-[#000000] rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs hover:bg-[#FAF7F2]"
                      title="Print Tax Invoice"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Invoice</span>
                    </a>

                    <button
                      onClick={() => handleReorder(order._id)}
                      className="px-4 py-2 border border-[#EAE3D9] hover:border-[#000000] bg-white text-[#000000] rounded-full text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs hover:bg-[#FAF7F2]"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reorder</span>
                    </button>

                    <Link
                      to={`/order/${order.orderNumber}`}
                      className="px-5 py-2 bg-[#C84B20] hover:bg-[#A33A16] text-white rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-[#C84B20]/25 active:scale-98 cursor-pointer"
                    >
                      <span>Track Order</span>
                      <ArrowRight className="w-3.5 h-3.5" />
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
