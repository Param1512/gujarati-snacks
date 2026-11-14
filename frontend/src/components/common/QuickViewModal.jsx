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
      <div className="fixed inset-0 bg-[#3A000A]/75 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-[#FFF9F2] border border-[#D6B77A]/30 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl z-10 animate-in fade-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#21191A]/60 hover:text-[#790B13] p-2 rounded-full hover:bg-[#FFF0DC] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="aspect-square bg-gradient-to-b from-[#FFF0DC]/40 to-[#FFF9F2] rounded-2xl border border-[#D6B77A]/30 overflow-hidden p-5 shadow-xs">
            <img
              src={primaryImage}
              alt={product.name}
              className="w-full h-full object-cover rounded-xl shadow-xs"
            />
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs font-heading font-bold text-[#790B13] mb-1">
                <span className="uppercase tracking-wider">{product.category?.name || 'Kathiyawadi Nasta'}</span>
                <span className="text-[#50000D] font-bold bg-[#FFF0DC] border border-[#D6B77A]/30 px-2.5 py-0.5 rounded-full text-[10px]">100% Sing-Tel</span>
              </div>

              <h3 className="font-heading font-bold text-2xl text-[#21191A] tracking-tight">
                {language === 'gu' && product.nameGujarati ? product.nameGujarati : product.name}
              </h3>

              <p className="text-xs text-[#21191A]/70 mt-2 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="pt-3 border-t border-[#D6B77A]/20 space-y-3 font-heading">
              <div className="flex justify-between items-center text-xs text-[#21191A]/70 font-bold uppercase tracking-wider">
                <span>Select Pack Size:</span>
                <span className="text-[#790B13] font-bold">₹{product.pricePerKg}/kg</span>
              </div>

              <div className="grid grid-cols-4 gap-1.5">
                {weightOptions.map((opt) => (
                  <button
                    key={opt.weightGrams}
                    onClick={() => setSelectedWeight(opt.weightGrams)}
                    className={`py-1.5 text-xs font-heading font-bold rounded-lg transition-all cursor-pointer ${
                      selectedWeight === opt.weightGrams
                        ? 'bg-[#50000D] text-[#FFF0DC] shadow-xs border border-[#D6B77A]/40'
                        : 'bg-[#FFF0DC]/60 text-[#21191A] border border-[#D6B77A]/30 hover:border-[#790B13]'
                    }`}
                  >
                    {opt.label || `${opt.weightGrams}g`}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 pt-3 border-t border-[#D6B77A]/20">
              <div>
                <span className="text-[10px] text-[#21191A]/60 uppercase font-heading font-bold block">
                  Total Price
                </span>
                <span className="text-3xl font-heading font-black text-[#790B13]">
                  ₹{currentPrice * quantity}
                </span>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center border border-[#D6B77A]/30 rounded-full bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1 px-3 text-[#21191A] hover:bg-[#FFF0DC] rounded-l-full cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-2 font-mono font-bold text-sm text-[#21191A]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-1 px-3 text-[#21191A] hover:bg-[#FFF0DC] rounded-r-full cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleAdd}
                className={`flex-1 py-3 px-6 rounded-full text-xs font-heading font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                  added
                    ? 'bg-[#174D35] text-white'
                    : 'bg-[#50000D] hover:bg-[#790B13] text-[#FFF0DC] border border-[#D6B77A]/40'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Added to Bag!</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 text-[#D6B77A]" />
                    <span>Add to Bag</span>
                  </>
                )}
              </button>

              <button
                onClick={() => toggleWishlist(product._id)}
                className={`p-3 rounded-full border border-[#D6B77A]/30 transition-colors cursor-pointer ${
                  isFavorited
                    ? 'bg-[#FFF0DC] text-[#790B13] border-[#790B13]'
                    : 'bg-white text-[#21191A]/60 hover:text-[#790B13]'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-[#790B13] text-[#790B13]' : ''}`} />
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
