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
        className="fixed inset-0 bg-[#0F291E]/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-[#FAF7F2] shadow-2xl flex flex-col border-l border-[#EAE3D9]">
          
          {/* Header */}
          <div className="p-5 sm:p-6 bg-[#14382B] text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-[#F7C04A]" />
              </div>
              <h2 className="font-heading font-bold text-base text-white">
                {t('shoppingCart') || 'Shopping Dabba'}
              </h2>
              <span className="font-heading text-xs bg-[#C84B20] text-white font-bold px-2 py-0.5 rounded-full">
                {items.length}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-white/80 hover:text-white p-1 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Meter */}
          <div className="bg-[#EBF4EF] px-6 py-3 border-b border-[#EAE3D9] text-xs font-heading">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#14382B] shrink-0" />
              {freeDeliveryDiff > 0 ? (
                <p className="text-[#14382B]">
                  Add <span className="font-bold text-[#C84B20]">₹{freeDeliveryDiff}</span> more for <span className="font-bold underline decoration-[#D89B2B] decoration-2">Free Delivery</span>
                </p>
              ) : (
                <p className="text-[#14382B] font-bold flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#14382B] ring-2 ring-[#D89B2B]" />
                  Free Delivery Unlocked!
                </p>
              )}
            </div>
            <div className="w-full bg-[#D8CEBF]/40 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#D89B2B] to-[#C84B20] h-full rounded-full transition-all duration-300"
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
                <div className="w-16 h-16 rounded-2xl bg-[#EBF4EF] flex items-center justify-center mx-auto mb-4 border border-[#EAE3D9]">
                  <ShoppingBag className="w-8 h-8 text-[#14382B]" />
                </div>
                <p className="font-heading font-bold text-base text-[#1C1815]">
                  {t('cartEmpty') || 'Your Bag is Empty'}
                </p>
                <p className="text-xs text-[#6E675F] mt-1 max-w-xs mx-auto">
                  {t('cartEmptySub') || 'Explore our authentic homemade Gujarati snacks.'}
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/snacks');
                  }}
                  className="mt-6 bg-[#C84B20] hover:bg-[#A33A16] text-white text-xs font-heading font-bold px-6 py-3 rounded-full shadow-warm-glow transition-all cursor-pointer"
                >
                  {t('startShopping') || 'Explore All Snacks'}
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.itemKey}
                  className="flex gap-4 p-3.5 bg-white rounded-2xl border border-[#EAE3D9] shadow-xs relative"
                >
                  <img
                    src={item.imageUrl || '/images/snacks/tikha-gathiya.jpg'}
                    alt={item.name}
                    className="w-18 h-18 sm:w-20 sm:h-20 object-cover rounded-xl shrink-0 border border-[#EAE3D9]"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-heading font-bold text-xs sm:text-sm text-[#1C1815] truncate">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.itemKey)}
                          className="text-[#9C948B] hover:text-[#C84B20] p-0.5 cursor-pointer transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-[11px] font-heading text-[#6E675F]">
                        <span className="bg-[#EBF4EF] text-[#14382B] px-2 py-0.5 rounded-full font-bold text-[10px]">
                          {item.weightLabel}
                        </span>
                        <span className="font-mono">₹{item.pricePerKg}/kg</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-[#EAE3D9] rounded-full bg-[#FAF7F2]">
                        <button
                          onClick={() => updateQuantity(item.itemKey, -1)}
                          className="p-1 px-2 text-[#1C1815] hover:bg-[#EAE3D9] rounded-l-full transition-colors cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-mono font-bold text-[#1C1815]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.itemKey, 1)}
                          className="p-1 px-2 text-[#1C1815] hover:bg-[#EAE3D9] rounded-r-full transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-heading font-black text-base text-[#14382B]">
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
            <div className="border-t border-[#EAE3D9] p-5 sm:p-6 bg-white space-y-3 font-heading">
              <div className="flex items-center justify-between text-xs text-[#6E675F]">
                <span>Total Net Weight:</span>
                <span className="font-mono font-bold text-[#1C1815]">{totalKg} kg</span>
              </div>

              <div className="flex justify-between items-baseline pt-1 border-t border-[#EAE3D9]">
                <span className="text-sm font-bold text-[#1C1815]">
                  {t('subtotal') || 'Subtotal'}
                </span>
                <span className="text-2xl font-black text-[#C84B20]">
                  ₹{subtotal}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-[#C84B20] hover:bg-[#A33A16] text-white py-3.5 rounded-full font-heading font-black text-sm flex items-center justify-center gap-2 shadow-warm-glow transition-all cursor-pointer"
              >
                <span>{t('proceedToCheckout') || 'Proceed to Checkout'}</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>

              {/* WhatsApp Checkout Option */}
              <a
                href={getWhatsAppCartMessage()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#14382B] hover:bg-[#0D261C] text-white py-2.5 rounded-full font-heading font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <MessageCircle className="w-4 h-4 text-[#F7C04A]" />
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
