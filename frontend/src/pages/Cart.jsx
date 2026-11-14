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
  Sparkles,
  ShieldCheck,
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
      <div className="max-w-2xl mx-auto px-4 py-28 text-center font-sans text-[#21191A]">
        <div className="w-20 h-20 bg-[#FFF0DC] rounded-full flex items-center justify-center mx-auto mb-6 border border-[#D6B77A]/40 shadow-sm">
          <ShoppingBag className="w-10 h-10 text-[#790B13]" />
        </div>
        <span className="font-mono text-xs uppercase tracking-widest text-[#790B13] font-bold block mb-2">
          Your Culinary Bag is Empty
        </span>
        <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#21191A] uppercase tracking-tight">
          No Delicacies <span className="font-serif italic font-normal lowercase text-[#790B13]">selected</span>
        </h2>
        <p className="text-xs sm:text-sm text-[#21191A]/70 max-w-sm mx-auto mt-3 mb-8 leading-relaxed">
          {t('cartEmptySub') || 'Explore our artisanal Kathiyawadi recipes freshly prepared in cold-pressed pure groundnut oil.'}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 text-xs font-mono uppercase tracking-widest">
          <Link
            to="/snacks"
            className="bg-[#790B13] hover:bg-[#50000D] text-[#FFF0DC] px-8 py-4 rounded-full shadow-lg shadow-[#790B13]/20 transition-all text-center"
          >
            {t('startShopping') || 'Explore All Snacks'}
          </Link>
          <Link
            to="/combo-builder"
            className="border border-[#D6B77A]/40 hover:border-[#790B13] bg-white text-[#21191A] px-8 py-4 rounded-full transition-colors text-center shadow-xs"
          >
            Bespoke Hamper Builder
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-12 font-sans text-[#21191A] selection:bg-[#790B13] selection:text-white">
      {/* Editorial Header */}
      <div className="border-b border-[#D6B77A]/20 pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-[#790B13] font-bold block mb-2">
            Selected Commissions
          </span>
          <h1 className="font-heading font-black text-3xl sm:text-5xl text-[#21191A] tracking-tight uppercase">
            Shopping <span className="font-serif italic font-normal lowercase text-[#790B13]">bag</span>
          </h1>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-[#21191A]/70">
          <span className="px-3 py-1 rounded-full bg-[#FFF0DC] border border-[#D6B77A]/40 text-[#790B13] font-bold">
            {items.length} item{items.length > 1 ? 's' : ''}
          </span>
          <span>•</span>
          <span className="text-[#21191A] font-bold">{totalKg} kg net weight</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-5">
          {/* Free delivery threshold meter */}
          <div className="bg-[#FFF0DC] p-5 rounded-2xl border border-[#D6B77A]/40 text-xs shadow-xs">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#790B13] shrink-0" />
                {freeDeliveryDiff > 0 ? (
                  <p className="text-[#21191A] font-medium">
                    Add <span className="font-bold text-[#790B13]">₹{freeDeliveryDiff}</span> more to unlock <span className="text-[#790B13] font-bold uppercase tracking-wider">Complimentary Delivery</span>
                  </p>
                ) : (
                  <p className="text-[#790B13] font-bold uppercase tracking-wider flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-[#790B13] ring-2 ring-[#D6B77A]" />
                    Complimentary Express Delivery Unlocked!
                  </p>
                )}
              </div>
              <span className="font-mono text-[11px] text-[#21191A]/60">Threshold: ₹{settings.freeDeliveryThreshold}</span>
            </div>
            <div className="w-full bg-white rounded-full h-1.5 mt-3 overflow-hidden border border-[#D6B77A]/20">
              <div
                className="bg-gradient-to-r from-[#D6B77A] via-[#A84C55] to-[#790B13] h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, (subtotal / settings.freeDeliveryThreshold) * 100)}%`,
                }}
              />
            </div>
          </div>

          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.itemKey}
                className="bg-white p-5 sm:p-6 rounded-2xl border border-[#D6B77A]/30 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:border-[#790B13]/30 transition-colors"
              >
                <div className="flex items-center gap-5 min-w-0">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border border-[#D6B77A]/30 shrink-0 bg-[#FFF9F2]">
                    <img
                      src={item.imageUrl || '/images/snacks/tikha-gathiya.jpg'}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-heading font-black text-base sm:text-lg text-[#21191A] uppercase tracking-tight truncate">
                      {item.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5 font-mono text-xs">
                      <span className="bg-[#FFF0DC] text-[#790B13] border border-[#D6B77A]/40 px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider">
                        {item.weightLabel}
                      </span>
                      <span className="text-[#21191A]/60">₹{item.pricePerKg}/kg</span>
                    </div>
                    <span className="text-xs text-[#21191A]/60 font-medium block mt-1">
                      ₹{item.unitPrice} per pack
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-6 sm:gap-8 pt-4 sm:pt-0 border-t sm:border-0 border-[#D6B77A]/20">
                  {/* Quantity selector */}
                  <div className="flex items-center border border-[#D6B77A]/40 rounded-full bg-[#FFF9F2] shadow-xs">
                    <button
                      onClick={() => updateQuantity(item.itemKey, -1)}
                      className="p-1 px-3 text-[#21191A] hover:bg-[#FFF0DC] rounded-l-full cursor-pointer transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-mono font-bold text-[#21191A]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.itemKey, 1)}
                      className="p-1 px-3 text-[#21191A] hover:bg-[#FFF0DC] rounded-r-full cursor-pointer transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right">
                    <span className="block font-heading font-black text-lg sm:text-xl text-[#790B13]">
                      ₹{item.itemSubtotal}
                    </span>
                    <span className="text-[10px] font-mono text-[#21191A]/60">
                      {(item.totalGrams / 1000).toFixed(2)} kg
                    </span>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.itemKey)}
                    className="text-[#21191A]/40 hover:text-[#790B13] p-1.5 cursor-pointer transition-colors rounded-full hover:bg-rose-50"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4 font-mono text-xs uppercase tracking-widest">
            <Link
              to="/snacks"
              className="text-[#790B13] hover:underline flex items-center gap-1.5 font-bold"
            >
              ← Continue Shopping
            </Link>
            <button
              onClick={clearCart}
              className="text-[#21191A]/50 hover:text-[#790B13] hover:underline cursor-pointer transition-colors"
            >
              Empty Bag
            </button>
          </div>
        </div>

        {/* Order Summary & Checkout Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#D6B77A]/30 shadow-xl space-y-6">
            <div className="border-b border-[#D6B77A]/20 pb-4">
              <span className="font-mono text-xs uppercase tracking-widest text-[#790B13] font-bold block mb-1">
                Receipt Preview
              </span>
              <h3 className="font-heading font-black text-xl text-[#21191A] uppercase tracking-tight">
                {t('orderSummary') || 'Order Summary'}
              </h3>
            </div>

            {/* Total weight breakdown */}
            <div className="flex items-center justify-between text-xs text-[#21191A]/70 bg-[#FFF0DC] p-3.5 rounded-2xl border border-[#D6B77A]/40 font-mono">
              <span className="font-bold text-[#790B13] uppercase tracking-wider">Consignment Weight:</span>
              <span className="font-bold text-[#21191A]">
                {totalKg} kg ({totalGrams} g)
              </span>
            </div>

            {/* Coupon Code Box */}
            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70">
                Promotional Voucher
              </label>
              {coupon ? (
                <div className="flex items-center justify-between bg-[#FFF0DC] text-[#790B13] p-3 rounded-xl border border-[#D6B77A]/40 text-xs font-mono font-bold">
                  <span>[{coupon.code}] -₹{coupon.discountAmount}</span>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-[#790B13] text-xs hover:underline cursor-pointer ml-2 uppercase"
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
                    placeholder="e.g. WELCOME10"
                    className="flex-1 bg-[#FFF9F2] border border-[#D6B77A]/30 rounded-xl px-4 py-2.5 text-xs uppercase font-mono text-[#21191A] focus:outline-none focus:border-[#790B13]"
                  />
                  <button
                    type="submit"
                    disabled={couponLoading}
                    className="bg-[#21191A] hover:bg-[#790B13] text-[#FFF0DC] px-5 py-2.5 text-xs font-mono uppercase tracking-wider font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    {couponLoading ? '...' : 'Apply'}
                  </button>
                </form>
              )}
              {couponError && <p className="text-xs text-rose-600 font-mono">{couponError}</p>}
              {couponSuccess && <p className="text-xs text-emerald-700 font-mono font-bold">{couponSuccess}</p>}
            </div>

            {/* Cost Breakdown */}
            <div className="space-y-3 pt-3 border-t border-[#D6B77A]/20 text-xs">
              <div className="flex justify-between text-[#21191A]/70 font-mono">
                <span>Subtotal</span>
                <span className="font-bold text-[#21191A]">₹{subtotal}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-[#790B13] font-mono font-bold">
                  <span>Promotional Privilege</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}

              <div className="flex justify-between text-[#21191A]/70 font-mono">
                <span>Delivery Charge</span>
                <span className="font-bold text-[#21191A]">
                  {isFreeDelivery ? 'FREE' : `₹${estimatedDelivery}`}
                </span>
              </div>

              <div className="pt-4 border-t border-[#D6B77A]/20 flex justify-between items-baseline">
                <span className="font-heading font-black text-base uppercase text-[#21191A]">Total Amount:</span>
                <span className="font-heading font-black text-3xl text-[#790B13]">₹{grandTotal}</span>
              </div>
            </div>

            {isAuthenticated && user ? (
              <div className="bg-[#FFF0DC] p-3 rounded-xl text-xs text-[#790B13] font-mono text-center border border-[#D6B77A]/40">
                Ordering as <strong>{user.name || user.email}</strong>
              </div>
            ) : (
              <div className="text-xs text-[#21191A]/70 text-center font-sans">
                Returning patron?{' '}
                <Link to="/login?redirect=/checkout" className="text-[#790B13] font-bold underline hover:text-[#50000D]">
                  Sign In
                </Link>{' '}
                or continue as guest.
              </div>
            )}

            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-[#790B13] hover:bg-[#50000D] text-[#FFF0DC] py-4 rounded-full text-xs font-mono uppercase tracking-widest font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#790B13]/25 hover:shadow-xl transition-all cursor-pointer group"
            >
              <span>{t('checkout') || 'Proceed to Secure Checkout'}</span>
              <ArrowRight className="w-4 h-4 text-[#D6B77A] group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              href={getWhatsAppCartMessage(settings.whatsappNumber)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-white border border-[#D6B77A]/40 hover:border-[#790B13] text-[#21191A] py-3.5 rounded-full text-xs font-mono uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-colors text-center cursor-pointer shadow-xs"
            >
              <MessageCircle className="w-4 h-4 text-[#790B13]" />
              <span>WhatsApp Direct Order</span>
            </a>
          </div>

          <div className="p-5 bg-[#FFF0DC] rounded-2xl border border-[#D6B77A]/40 text-xs text-[#21191A]/80 space-y-2 shadow-xs">
            <span className="font-heading font-black text-sm uppercase text-[#790B13] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#D6B77A]" /> Pure Groundnut Oil Authenticity
            </span>
            <p className="leading-relaxed text-xs">
              Every package is fried fresh upon order in Rajkot, vacuum sealed in triple-barrier moisture food grade pouches, ensuring crunch and aroma for weeks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
