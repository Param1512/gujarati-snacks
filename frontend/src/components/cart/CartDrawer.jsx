import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { useSettings } from '../../context/SettingsContext';
import { useAuth } from '../../context/AuthContext';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  MessageCircle,
  Truck,
  Sparkles,
} from 'lucide-react';

const CartDrawer = () => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    totalKg,
    getWhatsAppCartMessage,
  } = useCart();
  const { t } = useLanguage();
  const { settings } = useSettings();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  const freeDeliveryDiff = settings.freeDeliveryThreshold - subtotal;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#3A000A]/75 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-[#FFF9F2] shadow-2xl flex flex-col border-l border-[#D6B77A]/30">
          
          {/* Header */}
          <div className="p-5 sm:p-6 bg-[#50000D] text-[#FFF0DC] flex items-center justify-between border-b border-[#D6B77A]/30">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#FFF0DC]/10 border border-[#D6B77A]/30 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-[#D6B77A]" />
              </div>
              <h2 className="font-heading font-bold text-base text-[#FFF0DC] uppercase tracking-wider">
                {t('shoppingCart') || 'Shopping Bag'}
              </h2>
              <span className="font-heading text-xs bg-[#790B13] text-[#FFF0DC] border border-[#D6B77A]/30 font-bold px-2 py-0.5 rounded-full">
                {items.length}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-[#FFF0DC]/80 hover:text-[#FFF0DC] p-1 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Meter */}
          <div className="bg-[#FFF0DC] px-6 py-3.5 border-b border-[#D6B77A]/30 text-xs font-heading">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#790B13] shrink-0" />
              {freeDeliveryDiff > 0 ? (
                <p className="text-[#21191A]">
                  Add <span className="font-bold text-[#790B13]">₹{freeDeliveryDiff}</span> more for <span className="font-bold text-[#50000D] underline decoration-[#D6B77A] decoration-2">Complimentary Delivery</span>
                </p>
              ) : (
                <p className="text-[#50000D] font-bold flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#174D35] ring-2 ring-[#D6B77A]" />
                  Complimentary Doorstep Delivery Unlocked!
                </p>
              )}
            </div>
            <div className="w-full bg-stone-200/80 rounded-full h-1.5 mt-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#D6B77A] to-[#790B13] h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, (subtotal / settings.freeDeliveryThreshold) * 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 rounded-2xl bg-[#FFF0DC] border border-[#D6B77A]/30 flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-8 h-8 text-[#50000D]" />
                </div>
                <p className="font-heading font-bold text-base text-[#21191A]">
                  {t('cartEmpty') || 'Your Bag is Empty'}
                </p>
                <p className="text-xs text-[#21191A]/60 mt-1 max-w-xs mx-auto">
                  {t('cartEmptySub') || 'Explore our authentic homemade Gujarati snacks.'}
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/snacks');
                  }}
                  className="mt-6 bg-[#50000D] hover:bg-[#790B13] text-[#FFF0DC] border border-[#D6B77A]/40 text-xs font-heading font-bold uppercase tracking-wider px-6 py-3 rounded-full shadow-md transition-all cursor-pointer"
                >
                  {t('startShopping') || 'Explore All Snacks'}
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.itemKey}
                  className="flex gap-4 p-3.5 bg-white rounded-2xl border border-[#D6B77A]/30 shadow-xs relative"
                >
                  <img
                    src={item.imageUrl || '/images/snacks/tikha-gathiya.jpg'}
                    alt={item.name}
                    className="w-18 h-18 sm:w-20 sm:h-20 object-cover rounded-xl shrink-0 border border-[#D6B77A]/20"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-heading font-bold text-xs sm:text-sm text-[#21191A] truncate">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.itemKey)}
                          className="text-[#21191A]/40 hover:text-[#790B13] p-0.5 cursor-pointer transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-[11px] font-heading text-[#21191A]/70">
                        <span className="bg-[#FFF0DC] text-[#790B13] border border-[#D6B77A]/30 px-2 py-0.5 rounded-md font-bold text-[10px]">
                          {item.weightLabel}
                        </span>
                        <span className="font-mono">₹{item.pricePerKg}/kg</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-[#D6B77A]/30 rounded-full bg-[#FFF9F2]">
                        <button
                          onClick={() => updateQuantity(item.itemKey, -1)}
                          className="p-1 px-2 text-[#21191A] hover:bg-[#FFF0DC] rounded-l-full transition-colors cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-mono font-bold text-[#21191A]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.itemKey, 1)}
                          className="p-1 px-2 text-[#21191A] hover:bg-[#FFF0DC] rounded-r-full transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-heading font-black text-base text-[#790B13]">
                        ₹{item.itemSubtotal}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Bottom Summary & Checkout */}
          {items.length > 0 && (
            <div className="border-t border-[#D6B77A]/30 p-5 sm:p-6 bg-[#FFF0DC]/40 space-y-3 font-heading">
              <div className="flex items-center justify-between text-xs text-[#21191A]/70 font-bold uppercase tracking-wider">
                <span>Total Net Weight:</span>
                <span className="font-mono font-bold text-[#21191A]">{totalKg} kg</span>
              </div>

              <div className="flex justify-between items-baseline pt-1 border-t border-[#D6B77A]/20">
                <span className="text-sm font-bold text-[#21191A] uppercase tracking-wider">
                  {t('subtotal') || 'Subtotal'}
                </span>
                <span className="text-2xl font-black text-[#790B13]">
                  ₹{subtotal}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-[#50000D] hover:bg-[#790B13] text-[#FFF0DC] border border-[#D6B77A]/40 py-3.5 rounded-full font-heading font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <span>{t('proceedToCheckout') || 'Proceed to Checkout'}</span>
                <ArrowRight className="w-4 h-4 text-[#D6B77A]" />
              </button>

              {/* WhatsApp Checkout Option */}
              <a
                href={getWhatsAppCartMessage()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-white hover:bg-[#FFF0DC] text-[#50000D] border border-[#D6B77A]/40 py-2.5 rounded-full font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <MessageCircle className="w-4 h-4 text-[#790B13]" />
                <span>Order via WhatsApp Direct</span>
              </a>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
