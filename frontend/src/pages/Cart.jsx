import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  MessageCircle,
  Truck,
  Leaf,
} from 'lucide-react';

const Cart = () => {
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    totalKg,
    totalGrams,
    coupon,
    setCoupon,
    getWhatsAppCartMessage,
  } = useCart();
  const { t } = useLanguage();
  const { settings } = useSettings();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Handle coupon validation
  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;

    setCouponLoading(true);
    setCouponError('');
    setCouponSuccess('');

    try {
      const res = await api.post('/coupons/validate', {
        code: couponCodeInput.trim(),
        cartTotal: subtotal,
      });

      if (res.success) {
        setCoupon(res.coupon);
        setCouponSuccess(`Coupon '${res.coupon.code}' applied: ₹${res.coupon.discountAmount} saved!`);
      }
    } catch (err) {
      setCouponError(err.message || 'Invalid coupon code');
      setCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCoupon(null);
    setCouponCodeInput('');
    setCouponSuccess('');
    setCouponError('');
  };

  const discountAmount = coupon ? coupon.discountAmount : 0;
  const isFreeDelivery = subtotal >= settings.freeDeliveryThreshold;
  const estimatedDelivery = isFreeDelivery ? 0 : settings.deliveryCharges?.localRajkot || 30;
  const grandTotal = Math.max(0, subtotal - discountAmount + estimatedDelivery);
  const freeDeliveryDiff = settings.freeDeliveryThreshold - subtotal;

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center font-sans text-[#000000]">
        <div className="w-16 h-16 bg-[#EBF4EF] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#EAE3D9]">
          <ShoppingBag className="w-8 h-8 text-[#000000]" />
        </div>
        <h2 className="font-heading font-black text-3xl text-[#000000] tracking-tight">
          {t('cartEmpty') || 'Your Bag is Empty'}
        </h2>
        <p className="text-xs text-[#555555] max-w-sm mx-auto mt-2 mb-8 leading-relaxed">
          {t('cartEmptySub') || 'Discover authentic Kathiyawadi homemade snacks fried fresh daily in pure Sing-Tel.'}
        </p>
        <div className="flex justify-center gap-3 font-heading text-xs font-bold">
          <Link
            to="/snacks"
            className="bg-[#C84B20] hover:bg-[#A33A16] text-white px-7 py-3.5 rounded-full shadow-md shadow-[#C84B20]/20 transition-colors"
          >
            {t('startShopping') || 'Shop Snacks'}
          </Link>
          <Link
            to="/combo-builder"
            className="border border-[#EAE3D9] hover:bg-[#FAF7F2] bg-white text-[#000000] px-7 py-3.5 rounded-full transition-colors"
          >
            Combo Builder
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10 font-sans text-[#000000]">
      {/* Header */}
      <div className="border-b border-[#EAE3D9] pb-6">
        <span className="font-heading text-xs font-black uppercase tracking-wider text-[#C84B20] block mb-1">
          Review Your Order
        </span>
        <h1 className="font-heading font-black text-3xl sm:text-4xl text-[#000000] tracking-tight">
          Shopping <span className="text-[#C84B20]">Bag</span>
        </h1>
        <p className="text-xs text-[#555555] mt-1 font-medium">
          {items.length} item{items.length > 1 ? 's' : ''} • {totalKg} kg net weight
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {/* Free delivery threshold meter */}
          <div className="bg-[#EBF4EF] p-4 rounded-2xl border border-[#EAE3D9] font-heading text-xs">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#000000] shrink-0" />
              {freeDeliveryDiff > 0 ? (
                <p className="text-[#000000]">
                  Add <span className="font-bold text-[#C84B20]">₹{freeDeliveryDiff}</span> more snacks for <span className="text-[#000000] font-bold underline decoration-[#D89B2B] decoration-2">Free Delivery</span>
                </p>
              ) : (
                <p className="text-[#000000] font-bold flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#14382B] ring-2 ring-[#000000]" />
                  Free Delivery Unlocked!
                </p>
              )}
            </div>
            <div className="w-full bg-[#E5E5E0] rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#D89B2B] via-[#14382B] to-[#C84B20] h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, (subtotal / settings.freeDeliveryThreshold) * 100)}%`,
                }}
              />
            </div>
          </div>

          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.itemKey}
                className="bg-white p-4 sm:p-5 rounded-3xl border border-[#EAE3D9] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <img
                    src={item.imageUrl || '/images/snacks/tikha-gathiya.jpg'}
                    alt={item.name}
                    className="w-18 h-18 sm:w-20 sm:h-20 object-cover rounded-2xl border border-[#EAE3D9] shrink-0"
                  />
                  <div>
                    <h3 className="font-heading font-bold text-sm sm:text-base text-[#000000] truncate">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 font-heading text-xs text-[#555555]">
                      <span className="bg-[#14382B] text-[#000000] px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                        {item.weightLabel}
                      </span>
                      <span className="font-mono">Rate: ₹{item.pricePerKg}/kg</span>
                    </div>
                    <span className="text-xs text-[#555555] font-medium block mt-1">
                      ₹{item.unitPrice} per pack
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-6 sm:gap-8 pt-3 sm:pt-0 border-t sm:border-0 border-[#EAE3D9]">
                  {/* Quantity selector */}
                  <div className="flex items-center border border-[#EAE3D9] rounded-full bg-[#FAF7F2]">
                    <button
                      onClick={() => updateQuantity(item.itemKey, -1)}
                      className="p-1 px-2.5 text-[#000000] hover:bg-[#E5E5E0] rounded-l-full cursor-pointer transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-2.5 text-xs font-mono font-bold text-[#000000]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.itemKey, 1)}
                      className="p-1 px-2.5 text-[#000000] hover:bg-[#E5E5E0] rounded-r-full cursor-pointer transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right">
                    <span className="block font-heading font-black text-lg text-[#000000]">
                      ₹{item.itemSubtotal}
                    </span>
                    <span className="text-[10px] text-[#555555] font-medium">
                      {(item.totalGrams / 1000).toFixed(2)} kg
                    </span>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.itemKey)}
                    className="text-[#777777] hover:text-[#C84B20] p-1 cursor-pointer transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-3 font-heading text-xs font-bold">
            <Link
              to="/snacks"
              className="text-[#000000] hover:underline"
            >
              ← Continue Shopping
            </Link>
            <button
              onClick={clearCart}
              className="text-[#C84B20] hover:underline cursor-pointer"
            >
              Empty Bag
            </button>
          </div>
        </div>

        {/* Order Summary & Checkout Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#EAE3D9] shadow-xs space-y-5 font-heading">
            <h3 className="font-black text-lg text-[#000000] border-b border-[#EAE3D9] pb-3">
              {t('orderSummary') || 'Summary'}
            </h3>

            {/* Total weight breakdown */}
            <div className="flex items-center justify-between text-xs text-[#555555] bg-[#EBF4EF] p-3 rounded-2xl border border-[#EAE3D9]">
              <span className="font-bold text-[#000000]">Total Weight:</span>
              <span className="font-mono font-bold text-[#000000]">
                {totalKg} kg ({totalGrams} g)
              </span>
            </div>

            {/* Coupon Code Box */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#000000]">
                Have a Promo Code?
              </label>
              {coupon ? (
                <div className="flex items-center justify-between bg-[#EBF4EF] text-[#000000] p-3 rounded-2xl border border-[#EAE3D9] text-xs font-bold">
                  <span>[{coupon.code}] -₹{coupon.discountAmount}</span>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-[#C84B20] text-xs hover:underline cursor-pointer ml-2"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                    placeholder="e.g. FESTIVE10"
                    className="flex-1 bg-[#FAF7F2] border border-[#EAE3D9] rounded-full px-4 py-2 text-xs uppercase font-mono text-[#000000] focus:outline-none focus:border-[#000000]"
                  />
                  <button
                    type="submit"
                    disabled={couponLoading}
                    className="bg-[#000000] text-white px-5 py-2 text-xs font-bold rounded-full hover:bg-[#1a1a1a] transition-colors cursor-pointer"
                  >
                    {couponLoading ? '...' : 'Apply'}
                  </button>
                </form>
              )}
              {couponError && <p className="text-xs text-rose-600 font-sans">{couponError}</p>}
              {couponSuccess && <p className="text-xs text-[#000000] font-sans font-bold">{couponSuccess}</p>}
            </div>

            {/* Cost Breakdown */}
            <div className="space-y-3 pt-3 border-t border-[#EAE3D9] text-xs">
              <div className="flex justify-between text-[#555555]">
                <span>Subtotal:</span>
                <span className="font-mono font-bold text-[#000000]">₹{subtotal}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-[#C84B20] font-bold">
                  <span>Discount:</span>
                  <span className="font-mono">-₹{discountAmount}</span>
                </div>
              )}

              <div className="flex justify-between text-[#555555]">
                <span>Estimated Delivery:</span>
                <span className="font-mono font-bold text-[#000000]">
                  {isFreeDelivery ? 'FREE' : `₹${estimatedDelivery}`}
                </span>
              </div>

              <div className="pt-3 border-t border-[#EAE3D9] flex justify-between items-baseline">
                <span className="font-black text-base text-[#000000]">Total:</span>
                <span className="font-black text-3xl text-[#C84B20]">₹{grandTotal}</span>
              </div>
            </div>

            {isAuthenticated && user ? (
              <div className="bg-[#EBF4EF] p-2.5 rounded-2xl text-[11px] text-[#000000] font-medium text-center border border-[#14382B]/50">
                ✓ Ordering as <strong>{user.name || user.email}</strong>
              </div>
            ) : (
              <div className="text-[11px] text-[#555555] text-center font-sans">
                Have an account? <Link to="/login?redirect=/checkout" className="text-[#000000] font-bold underline hover:text-[#C84B20]">Sign In</Link> or register during checkout.
              </div>
            )}

            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-[#C84B20] hover:bg-[#A33A16] text-white py-4 rounded-full text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#C84B20]/25 transition-all cursor-pointer"
            >
              <span>{t('checkout') || 'Proceed to Checkout'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href={getWhatsAppCartMessage(settings.whatsappNumber)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#000000] hover:bg-[#1a1a1a] text-[#14382B] py-3 rounded-full text-xs font-bold flex items-center justify-center gap-2 transition-colors text-center cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-[#14382B]" />
              <span>WhatsApp Direct Order</span>
            </a>
          </div>

          <div className="p-4 bg-[#EBF4EF] rounded-2xl border border-[#14382B]/60 text-xs text-[#555555] space-y-1 font-sans">
            <span className="font-heading font-bold text-[#000000] flex items-center gap-1.5">
              <Leaf className="w-3.5 h-3.5 text-[#000000]" /> Pure Sing-Tel Promise
            </span>
            <p className="leading-relaxed text-[11px]">
              Every parcel is assembled from daily morning frying batches in Rajkot and sealed in food-grade barrier pouches.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
