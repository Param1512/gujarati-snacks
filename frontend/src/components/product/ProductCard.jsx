import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useLanguage } from '../../context/LanguageContext';
import { Heart, Plus, Eye, Check, Sparkles } from 'lucide-react';

const ProductCard = ({ product, onQuickView }) => {
  const { addToCart, setIsCartOpen } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { t, language } = useLanguage();

  const defaultWeight = product.weightOptions?.[1]?.weightGrams || product.weightOptions?.[0]?.weightGrams || 500;
  const [selectedWeight, setSelectedWeight] = useState(defaultWeight);
  const [justAdded, setJustAdded] = useState(false);

  const isFavorited = isInWishlist(product._id);
  const currentPrice = Math.round((product.pricePerKg * selectedWeight) / 1000);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, selectedWeight, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
    setIsCartOpen(true);
  };

  const primaryImage =
    product.images?.find((img) => img.isPrimary)?.url ||
    product.images?.[0]?.url ||
    '/images/snacks/tikha-gathiya.jpg';

  const weightOptions = product.weightOptions || [
    { weightGrams: 250, label: '250g' },
    { weightGrams: 500, label: '500g' },
    { weightGrams: 1000, label: '1kg' },
    { weightGrams: 2000, label: '2kg' },
  ];

  return (
    <article className="group bg-[#FFF9F2] border border-[#D6B77A]/30 hover:border-[#790B13]/60 rounded-3xl flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 relative">
      
      {/* Top Badges & Wishlist */}
      <div className="absolute top-3.5 left-3.5 z-10 flex flex-col gap-1.5 items-start">
        {product.isBestseller && (
          <span className="bg-[#50000D] text-[#D6B77A] text-[10px] font-heading font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-[#D6B77A]/40 shadow-xs flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-[#D6B77A]" />
            Bestseller
          </span>
        )}
        {product.isCombo && (
          <span className="bg-[#790B13] text-[#FFF0DC] text-[10px] font-heading font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
            Special Hamper
          </span>
        )}
      </div>

      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(product._id);
        }}
        className="absolute top-3.5 right-3.5 z-10 p-2.5 bg-white/90 backdrop-blur-xs rounded-full border border-[#D6B77A]/30 text-[#21191A]/50 hover:text-[#790B13] hover:border-[#790B13]/40 transition-all cursor-pointer shadow-xs"
        title="Add to Wishlist"
      >
        <Heart className={`w-4 h-4 ${isFavorited ? 'fill-[#790B13] text-[#790B13]' : ''}`} />
      </button>

      {/* Image Container with Warm Ivory Backdrop */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-b from-[#FFF0DC]/40 to-[#FFF9F2] border-b border-[#D6B77A]/20">
        <Link to={`/snacks/${product.slug || product._id}`} className="block w-full h-full p-3 sm:p-6">
          <img
            src={primaryImage}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover rounded-2xl group-hover:scale-106 transition-transform duration-500 shadow-sm"
            onError={(e) => {
              e.target.src = '/images/snacks/tikha-gathiya.jpg';
            }}
          />
        </Link>

        {onQuickView && (
          <button
            onClick={() => onQuickView(product)}
            className="absolute bottom-2.5 left-3 right-3 sm:bottom-3 sm:left-4 sm:right-4 bg-[#50000D]/90 hover:bg-[#790B13] backdrop-blur-xs text-[#FFF0DC] text-[10px] sm:text-xs font-heading font-bold uppercase tracking-wider py-2 sm:py-2.5 rounded-xl opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer shadow-md min-h-[36px]"
          >
            <Eye className="w-3.5 h-3.5 text-[#D6B77A]" />
            <span>{t('quickView') || 'Quick View'}</span>
          </button>
        )}
      </div>

      {/* Product Content Details */}
      <div className="p-3.5 sm:p-5 flex-1 flex flex-col justify-between space-y-3 sm:space-y-4">
        <div>
          {/* Category & Per-kg rate */}
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-heading font-bold text-[#790B13] mb-1">
            <span className="truncate uppercase tracking-wider max-w-[65%]">{product.category?.name || 'Kathiyawadi Nasta'}</span>
            <span className="text-[#50000D] font-black bg-[#FFF0DC] px-1.5 sm:px-2 py-0.5 rounded-md border border-[#D6B77A]/30 shrink-0">₹{product.pricePerKg}/kg</span>
          </div>

          {/* Product Title */}
          <Link to={`/snacks/${product.slug || product._id}`}>
            <h3 className="font-heading font-bold text-sm sm:text-lg text-[#21191A] hover:text-[#790B13] transition-colors line-clamp-1">
              {language === 'gu' && product.nameGujarati ? product.nameGujarati : product.name}
            </h3>
          </Link>

          {/* Short Description */}
          <p className="text-[11px] sm:text-xs text-[#21191A]/70 line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Weight Selector & Price Section */}
        <div className="pt-2.5 sm:pt-3 border-t border-[#D6B77A]/20 space-y-2.5 sm:space-y-3">
          <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-heading font-bold uppercase tracking-wider text-[#21191A]/60">
            <span>Pack Size:</span>
            <span className="text-[#790B13] font-bold bg-[#FFF0DC] px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[9px]">100% Sing-Tel</span>
          </div>

          {/* Weight Selection Buttons */}
          <div className="grid grid-cols-4 gap-1 sm:gap-1.5">
            {weightOptions.map((opt) => {
              const isSel = selectedWeight === opt.weightGrams;
              return (
                <button
                  key={opt.weightGrams}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedWeight(opt.weightGrams);
                  }}
                  className={`py-1 sm:py-1.5 px-0.5 sm:px-1 text-[10px] sm:text-xs font-heading font-bold rounded-lg transition-all cursor-pointer truncate ${
                    isSel
                      ? 'bg-[#50000D] text-[#FFF0DC] shadow-xs border border-[#D6B77A]/40'
                      : 'bg-[#FFF0DC]/60 text-[#21191A] border border-[#D6B77A]/30 hover:border-[#790B13]'
                  }`}
                >
                  {opt.label || `${opt.weightGrams}g`}
                </button>
              );
            })}
          </div>

          {/* Dynamic Price & Add to Cart */}
          <div className="flex items-center justify-between gap-2 sm:gap-3 pt-1">
            <div className="shrink-0">
              <span className="font-heading font-black text-xl sm:text-2xl text-[#790B13] leading-none block">
                ₹{currentPrice}
              </span>
              <span className="text-[9px] sm:text-[10px] text-[#21191A]/60 font-medium block mt-0.5">
                {selectedWeight >= 1000 ? `${selectedWeight / 1000}kg` : `${selectedWeight}g`} pack
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              className={`flex-1 py-2 sm:py-2.5 px-2.5 sm:px-4 rounded-xl text-[11px] sm:text-xs font-heading font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer shadow-sm active:scale-95 min-h-[40px] ${
                justAdded
                  ? 'bg-[#174D35] text-white'
                  : 'bg-[#50000D] hover:bg-[#790B13] text-[#FFF0DC] border border-[#D6B77A]/40'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span className="truncate">Added!</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5 text-[#D6B77A]" />
                  <span className="truncate">{t('addToCart')}</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </article>
  );
};

export default ProductCard;
