import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useLanguage } from '../../context/LanguageContext';
import { Heart, Plus, Eye, Check, Sparkles, Flame, ShieldCheck } from 'lucide-react';

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
    setTimeout(() => setJustAdded(false), 1600);
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

  // Spice level mapping for taste indicator
  const getSpiceBadge = () => {
    const nameLower = (product.name || '').toLowerCase();
    if (nameLower.includes('tikha') || nameLower.includes('jhaal') || nameLower.includes('masala')) {
      return { text: 'Spicy', icon: '🌶️🌶️' };
    }
    if (nameLower.includes('methi') || nameLower.includes('chatpati')) {
      return { text: 'Medium', icon: '🌶️' };
    }
    return { text: 'Mild Crunch', icon: '✨' };
  };

  const spiceBadge = getSpiceBadge();

  return (
    <article className="group relative bg-[#FFF9F2] border border-[#D6B77A]/30 hover:border-[#790B13]/70 rounded-3xl flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
      
      {/* Top Floating Glass Badges */}
      <div className="absolute top-3.5 left-3.5 z-20 flex flex-col gap-1.5 items-start pointer-events-none">
        {product.isBestseller && (
          <span className="bg-[#50000D] text-[#D6B77A] text-[10px] font-heading font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border border-[#D6B77A]/40 shadow-md flex items-center gap-1.5">
            <Sparkles className="w-2.5 h-2.5 text-[#D6B77A]" />
            Bestseller
          </span>
        )}
        {product.isCombo ? (
          <span className="bg-[#790B13] text-[#FFF0DC] text-[10px] font-heading font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border border-[#D6B77A]/30 shadow-md">
            Special Hamper
          </span>
        ) : (
          <span className="bg-[#FFF0DC]/90 backdrop-blur-md text-[#50000D] text-[9px] font-heading font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-[#D6B77A]/40">
            {spiceBadge.icon} {spiceBadge.text}
          </span>
        )}
      </div>

      {/* Wishlist Heart Button */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(product._id);
        }}
        className="absolute top-3.5 right-3.5 z-20 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md border border-[#D6B77A]/40 text-[#21191A]/60 hover:text-[#790B13] hover:border-[#790B13] flex items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-110 active:scale-95"
        title="Add to Wishlist"
      >
        <Heart className={`w-4 h-4 transition-colors ${isFavorited ? 'fill-[#790B13] text-[#790B13]' : ''}`} />
      </button>

      {/* Visual Product Showcase / Pedestal */}
      <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden bg-gradient-to-b from-[#FFF0DC]/60 via-[#FFF9F2] to-[#FFF9F2] border-b border-[#D6B77A]/20">
        {/* Subtle radial ambient spotlight behind image */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(214,183,122,0.18)_0%,transparent_70%)] pointer-events-none" />

        <Link to={`/snacks/${product.slug || product._id}`} className="block w-full h-full p-4 sm:p-6">
          <img
            src={primaryImage}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover rounded-2xl group-hover:scale-108 transition-transform duration-500 shadow-sm"
            onError={(e) => {
              e.target.src = '/images/snacks/tikha-gathiya.jpg';
            }}
          />
        </Link>

        {/* Quick View Floating Pill */}
        {onQuickView && (
          <button
            type="button"
            onClick={() => onQuickView(product)}
            className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-6 sm:right-6 bg-[#50000D]/95 hover:bg-[#790B13] backdrop-blur-md text-[#FFF0DC] text-[11px] font-heading font-bold uppercase tracking-wider py-2 sm:py-2.5 rounded-xl opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-xl"
          >
            <Eye className="w-3.5 h-3.5 text-[#D6B77A]" />
            <span>{t('quickView') || 'Quick View'}</span>
          </button>
        )}
      </div>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Category Tag & 100% Sing-Tel Seal */}
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-heading font-bold text-[#790B13] mb-1.5">
            <span className="truncate uppercase tracking-wider max-w-[65%]">
              {product.category?.name || 'Kathiyawadi Nasta'}
            </span>
            <span className="text-[#50000D] font-black bg-[#FFF0DC] px-2 py-0.5 rounded-md border border-[#D6B77A]/40 shrink-0 text-[10px]">
              ₹{product.pricePerKg}/kg
            </span>
          </div>

          {/* Product Title */}
          <Link to={`/snacks/${product.slug || product._id}`}>
            <h3 className="font-heading font-extrabold text-base sm:text-lg text-[#21191A] group-hover:text-[#790B13] transition-colors line-clamp-1 tracking-tight">
              {language === 'gu' && product.nameGujarati ? product.nameGujarati : product.name}
            </h3>
          </Link>

          {/* Description */}
          <p className="text-[11px] sm:text-xs text-[#21191A]/70 line-clamp-2 mt-1 leading-relaxed font-sans">
            {product.description}
          </p>
        </div>

        {/* Interactive Weight Selector & Dynamic Price Bar */}
        <div className="pt-3 border-t border-[#D6B77A]/25 space-y-3">
          <div className="flex items-center justify-between text-[10px] font-heading font-bold uppercase tracking-wider text-[#21191A]/60">
            <span>Choose Pack Size:</span>
            <span className="text-[#50000D] font-extrabold">100% Sing-Tel</span>
          </div>

          {/* Weight Selection Chips */}
          <div className="grid grid-cols-4 gap-1.5">
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
                  className={`py-1.5 px-1 text-[10px] sm:text-xs font-heading font-extrabold rounded-xl transition-all cursor-pointer truncate ${
                    isSel
                      ? 'bg-[#50000D] text-[#FFF0DC] shadow-md border border-[#D6B77A] scale-[1.02]'
                      : 'bg-[#FFF0DC]/60 text-[#21191A] border border-[#D6B77A]/30 hover:border-[#790B13] hover:bg-[#FFF0DC]'
                  }`}
                >
                  {opt.weightGrams >= 1000 ? `${opt.weightGrams / 1000}kg` : `${opt.weightGrams}g`}
                </button>
              );
            })}
          </div>

          {/* Dynamic Price Calculation & Add to Cart Pill */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <div className="shrink-0">
              <div className="flex items-baseline gap-1">
                <span className="font-heading font-black text-2xl sm:text-3xl text-[#790B13] leading-none">
                  ₹{currentPrice}
                </span>
              </div>
              <span className="text-[10px] text-[#21191A]/60 font-medium block mt-0.5">
                {selectedWeight >= 1000 ? `${selectedWeight / 1000}kg` : `${selectedWeight}g`} pack
              </span>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              className={`flex-1 py-2.5 px-3 sm:px-4 rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md hover:shadow-lg active:scale-95 min-h-[42px] ${
                justAdded
                  ? 'bg-[#174D35] text-white shadow-[#174D35]/30'
                  : 'bg-gradient-to-r from-[#50000D] to-[#790B13] hover:from-[#790B13] hover:to-[#50000D] text-[#FFF0DC] border border-[#D6B77A]/40'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span className="truncate">Added to Bag</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 text-[#D6B77A]" />
                  <span className="truncate">{t('addToCart') || 'Add to Bag'}</span>
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
