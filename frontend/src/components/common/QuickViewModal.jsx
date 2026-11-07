import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useLanguage } from '../../context/LanguageContext';
import { X, Heart, Plus, Minus, Check, Sparkles } from 'lucide-react';

const QuickViewModal = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { t, language } = useLanguage();

  const [selectedWeight, setSelectedWeight] = useState(
    product.weightOptions?.[1]?.weightGrams || product.weightOptions?.[0]?.weightGrams || 500
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const currentPrice = Math.round((product.pricePerKg * selectedWeight) / 1000);
  const isFavorited = isInWishlist(product._id);

  const handleAdd = () => {
    addToCart(product, selectedWeight, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 900);
  };

  const primaryImage =
    product.images?.[0]?.url ||
    '/images/snacks/tikha-gathiya.jpg';

  const weightOptions = product.weightOptions || [
    { weightGrams: 250, label: '250g' },
    { weightGrams: 500, label: '500g' },
    { weightGrams: 1000, label: '1kg' },
    { weightGrams: 2000, label: '2kg' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 font-sans">
      <div className="fixed inset-0 bg-[#0F291E]/70 backdrop-blur-xs" onClick={onClose} />

      <div className="relative bg-[#FAF7F2] border border-[#EAE3D9] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl z-10 animate-in fade-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#6E675F] hover:text-[#1C1815] p-2 rounded-full hover:bg-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="aspect-square bg-white rounded-2xl border border-[#EAE3D9] overflow-hidden p-4 shadow-xs">
            <img
              src={primaryImage}
              alt={product.name}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs font-heading font-semibold text-[#6E675F] mb-1">
                <span>{product.category?.name || 'Kathiyawadi Nasta'}</span>
                <span className="text-[#14382B] font-bold bg-[#EBF4EF] px-2 py-0.5 rounded-full text-[10px]">100% Sing-Tel</span>
              </div>

              <h3 className="font-heading font-black text-2xl text-[#1C1815] tracking-tight">
                {language === 'gu' && product.nameGujarati ? product.nameGujarati : product.name}
              </h3>

              <p className="text-xs text-[#6E675F] mt-2 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="pt-3 border-t border-[#EAE3D9] space-y-3 font-heading">
              <div className="flex justify-between items-center text-xs text-[#6E675F] font-bold">
                <span>Choose Pack Size:</span>
                <span className="text-[#14382B] font-bold">₹{product.pricePerKg}/kg</span>
              </div>

              <div className="grid grid-cols-4 gap-1.5">
                {weightOptions.map((opt) => (
                  <button
                    key={opt.weightGrams}
                    onClick={() => setSelectedWeight(opt.weightGrams)}
                    className={`py-1.5 text-xs font-heading font-bold rounded-full transition-all cursor-pointer ${
                      selectedWeight === opt.weightGrams
                        ? 'bg-[#14382B] text-white shadow-xs'
                        : 'bg-white text-[#1C1815] border border-[#EAE3D9] hover:border-[#14382B]'
                    }`}
                  >
                    {opt.label || `${opt.weightGrams}g`}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 pt-3 border-t border-[#EAE3D9]">
              <div>
                <span className="text-[10px] text-[#6E675F] uppercase font-heading font-bold block">
                  Total Price
                </span>
                <span className="text-3xl font-heading font-black text-[#C84B20]">
                  ₹{currentPrice * quantity}
                </span>
              </div>

              {/* Quantity */}
              <div className="flex items-center border border-[#EAE3D9] rounded-full bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1 px-3 text-[#1C1815] hover:bg-[#FAF7F2] rounded-l-full cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-2 font-mono font-bold text-sm text-[#1C1815]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-1 px-3 text-[#1C1815] hover:bg-[#FAF7F2] rounded-r-full cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleAdd}
                className={`flex-1 py-3 px-6 rounded-full text-xs font-heading font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-warm-glow ${
                  added
                    ? 'bg-[#14382B] text-[#F7C04A]'
                    : 'bg-[#C84B20] hover:bg-[#A33A16] text-white'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Dabba!</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Add to Dabba</span>
                  </>
                )}
              </button>

              <button
                onClick={() => toggleWishlist(product._id)}
                className={`p-3 rounded-full border border-[#EAE3D9] transition-colors cursor-pointer ${
                  isFavorited
                    ? 'bg-[#FDF4EC] text-[#C84B20] border-[#C84B20]'
                    : 'bg-white text-[#6E675F] hover:text-[#C84B20]'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-[#C84B20]' : ''}`} />
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
