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
    <article className="group bg-white border-2 border-[#F0E6D8] hover:border-[#FF4D2D] rounded-3xl flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-gourmet-lg hover:-translate-y-2 transition-all duration-300 relative">
      
      {/* Top Badges & Wishlist */}
      <div className="absolute top-3.5 left-3.5 z-10 flex flex-col gap-1 items-start">
        {product.isBestseller && (
          <span className="bg-[#FFB800] text-[#111827] text-[10px] font-heading font-black uppercase tracking-wider px-2.5 py-0.5 rounded-xl shadow-xs flex items-center gap-1 border border-black/10">
            <Sparkles className="w-2.5 h-2.5" />
            ★ Bestseller
          </span>
        )}
        {product.isCombo && (
          <span className="bg-[#7C3AED] text-white text-[10px] font-heading font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-xl shadow-xs">
            Gift Dabba
          </span>
        )}
      </div>

      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(product._id);
        }}
        className="absolute top-3.5 right-3.5 z-10 p-2.5 bg-white/90 backdrop-blur-xs rounded-full border border-[#F0E6D8] text-[#9CA3AF] hover:text-[#FF4D2D] hover:border-[#FF4D2D]/40 transition-all cursor-pointer shadow-xs"
        title="Add to Wishlist"
      >
        <Heart className={`w-4 h-4 ${isFavorited ? 'fill-[#FF4D2D] text-[#FF4D2D]' : ''}`} />
      </button>

      {/* Image Container with Warm Cardamom Backdrop */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-b from-[#FFF9F2] to-[#FFF5EA] border-b border-[#F0E6D8]">
        <Link to={`/snacks/${product.slug || product._id}`} className="block w-full h-full p-5">
          <img
            src={primaryImage}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover rounded-2xl group-hover:scale-108 transition-transform duration-500 shadow-sm"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80';
            }}
          />
        </Link>

        {onQuickView && (
          <button
            onClick={() => onQuickView(product)}
            className="absolute bottom-3 left-4 right-4 bg-[#111827]/90 hover:bg-[#FF4D2D] backdrop-blur-xs text-white text-xs font-heading font-black py-2.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{t('quickView') || 'Quick 3D View'}</span>
          </button>
        )}
      </div>

      {/* Product Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Metadata line: Category + Exact rate */}
          <div className="flex items-center justify-between text-[11px] font-heading font-bold text-[#4B5563] mb-1">
            <span className="truncate">{product.category?.name || 'Kathiyawadi Nasta'}</span>
            <span className="text-[#0D9468] font-black">₹{product.pricePerKg}/kg</span>
          </div>

          {/* Product Title */}
          <Link to={`/snacks/${product.slug || product._id}`}>
            <h3 className="font-heading font-black text-base sm:text-lg text-[#111827] hover:text-[#FF4D2D] transition-colors line-clamp-1">
              {language === 'gu' && product.nameGujarati ? product.nameGujarati : product.name}
            </h3>
          </Link>

          {/* Short Description */}
          <p className="text-xs text-[#4B5563] line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Weight Selector & Price Section */}
        <div className="pt-3 border-t border-[#F0E6D8] space-y-3">
          <div className="flex items-center justify-between text-[10px] font-heading font-bold uppercase tracking-wider text-[#4B5563]">
            <span>Pack Size:</span>
            <span className="text-[#0D9468] font-black bg-[#E8FDF5] px-2 py-0.5 rounded-full text-[9px]">100% Sing-Tel</span>
          </div>

          {/* Rounded Pill Weight Buttons */}
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
                  className={`py-1.5 px-1 text-xs font-heading font-black rounded-xl transition-all cursor-pointer ${
                    isSel
                      ? 'bg-[#111827] text-white shadow-xs'
                      : 'bg-[#FFFDF9] text-[#111827] border border-[#F0E6D8] hover:border-[#111827]'
                  }`}
                >
                  {opt.label || `${opt.weightGrams}g`}
                </button>
              );
            })}
          </div>

          {/* Dynamic Price & Add to Cart Action with 3D Depth */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <div>
              <span className="font-heading font-black text-2xl text-[#FF4D2D] leading-none block">
                ₹{currentPrice}
              </span>
              <span className="text-[10px] text-[#4B5563] font-medium block mt-0.5">
                {selectedWeight >= 1000 ? `${selectedWeight / 1000} kg` : `${selectedWeight} g`} pack
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-heading font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_4px_0_#A32510] active:translate-y-1 active:shadow-none ${
                justAdded
                  ? 'bg-[#0D9468] text-white shadow-[0_4px_0_#0A6C4D]'
                  : 'bg-[#FF4D2D] hover:bg-[#D9381E] text-white'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 text-white" />
                  <span>{t('addToCart')}</span>
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
