import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useLanguage } from '../context/LanguageContext';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/product/ProductCard';
import {
  Heart,
  Plus,
  Minus,
  Star,
  Check,
  MessageCircle,
  X,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Package,
  Clock,
} from 'lucide-react';

const ProductDetails = () => {
  const { identifier } = useParams();
  const { addToCart, setIsCartOpen } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { language } = useLanguage();
  const { settings } = useSettings();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedWeight, setSelectedWeight] = useState(500);
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  // Review modal
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewMessage, setReviewMessage] = useState('');

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const data = await api.get(`/products/${identifier}`);
        if (data.success) {
          setProduct(data.product);
          setRelatedProducts(data.relatedProducts || []);
          const defaultW = data.product.weightOptions?.[1]?.weightGrams || data.product.weightOptions?.[0]?.weightGrams || 500;
          setSelectedWeight(defaultW);
          setSelectedImage(data.product.images?.[0]?.url || '');

          // Fetch reviews
          const reviewData = await api.get(`/reviews/product/${data.product._id}`);
          if (reviewData.success) {
            setReviews(reviewData.reviews);
          }
        }
      } catch (err) {
        console.error('Failed to load product details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [identifier]);

  if (loading) {
    return (
      <div className="py-32 text-center font-heading text-xs text-[#21191A]/70 font-bold uppercase tracking-wider">
        <div className="w-8 h-8 border-2 border-[#790B13] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p>Loading Snack Dossier...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center font-heading">
        <h2 className="font-editorial text-3xl font-bold text-[#50000D]">Snack Not Found</h2>
        <p className="text-xs text-[#21191A]/70 font-sans mt-2 mb-6">
          The requested snack entry could not be located in our kitchen registry.
        </p>
        <Link
          to="/snacks"
          className="bg-[#50000D] hover:bg-[#790B13] text-[#FFF0DC] text-xs font-heading font-bold uppercase tracking-wider px-6 py-3 rounded-full shadow-md"
        >
          Browse All Snacks
        </Link>
      </div>
    );
  }

  const unitPrice = Math.round((product.pricePerKg * selectedWeight) / 1000);
  const totalPrice = unitPrice * quantity;
  const isFavorited = isInWishlist(product._id);

  const handleAddToCart = () => {
    addToCart(product, selectedWeight, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
    setIsCartOpen(true);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    setReviewSubmitting(true);
    setReviewMessage('');

    try {
      const res = await api.post('/reviews', {
        productId: product._id,
        rating: reviewRating,
        title: reviewTitle,
        comment: reviewComment,
      });

      if (res.success) {
        setReviewMessage('Thank you! Your verified review has been submitted.');
        setReviewComment('');
        setReviewTitle('');
        setTimeout(() => setShowReviewModal(false), 1500);
        const updatedReviews = await api.get(`/reviews/product/${product._id}`);
        if (updatedReviews.success) setReviews(updatedReviews.reviews);
      }
    } catch (err) {
      setReviewMessage(err.message || 'Failed to submit review');
    } finally {
      setReviewSubmitting(false);
    }
  };

  const productWhatsappUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
    `Namaste! I would like to order *${product.name}* (${selectedWeight >= 1000 ? `${selectedWeight / 1000}kg` : `${selectedWeight}g`}) - ₹${unitPrice} per pack. Is this available for dispatch from Rajkot?`
  )}`;

  const weightOptions = product.weightOptions || [
    { weightGrams: 250, label: '250g' },
    { weightGrams: 500, label: '500g' },
    { weightGrams: 1000, label: '1kg' },
    { weightGrams: 2000, label: '2kg' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 font-sans text-[#21191A] space-y-16">
      
      {/* Breadcrumb Navigation */}
      <nav className="font-heading text-xs uppercase tracking-wider text-[#21191A]/60 flex items-center gap-2">
        <Link to="/" className="hover:text-[#790B13]">Home</Link>
        <span>/</span>
        <Link to="/snacks" className="hover:text-[#790B13]">Shop</Link>
        <span>/</span>
        <span className="text-[#50000D] font-bold">{product.name}</span>
      </nav>

      {/* Product Presentation Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        
        {/* Left: Product Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-square bg-[#FFF9F2] rounded-3xl border border-[#D6B77A]/30 relative overflow-hidden shadow-sm p-6 flex items-center justify-center">
            <img
              src={selectedImage || '/images/snacks/tikha-gathiya.jpg'}
              alt={product.name}
              className="w-full h-full object-cover rounded-2xl shadow-xs"
            />
            <button
              onClick={() => toggleWishlist(product._id)}
              className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-xs rounded-full border border-[#D6B77A]/30 text-[#21191A]/50 hover:text-[#790B13] hover:border-[#790B13]/40 transition-all cursor-pointer shadow-xs"
              title="Add to Wishlist"
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-[#790B13] text-[#790B13]' : ''}`} />
            </button>
          </div>

          {/* Multiple Thumbnails */}
          {product.images?.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img.url)}
                  className={`w-20 h-20 bg-white rounded-2xl border-2 p-1.5 transition-all shrink-0 cursor-pointer ${
                    selectedImage === img.url ? 'border-[#50000D] shadow-xs' : 'border-[#D6B77A]/30 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover rounded-xl" />
                </button>
              ))}
            </div>
          )}

          {/* Technical Quality Strip */}
          <div className="grid grid-cols-2 gap-3 font-heading text-xs uppercase tracking-wider">
            <div className="bg-[#FFF0DC] p-4 rounded-2xl border border-[#D6B77A]/30 space-y-0.5">
              <span className="text-[10px] text-[#21191A]/70 font-semibold block flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#790B13]" /> Frying Medium
              </span>
              <span className="font-bold text-[#50000D] block text-xs">100% Pure Sing-Tel</span>
            </div>
            <div className="bg-[#FFF0DC] p-4 rounded-2xl border border-[#D6B77A]/30 space-y-0.5">
              <span className="text-[10px] text-[#21191A]/70 font-semibold block flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#790B13]" /> Batch Schedule
              </span>
              <span className="font-bold text-[#50000D] block text-xs">Fresh Morning Kadai</span>
            </div>
          </div>
        </div>

        {/* Right: Product Dossier & Purchase Engine */}
        <div className="lg:col-span-6 space-y-6">
          <div className="border-b border-[#D6B77A]/30 pb-6 space-y-2">
            <div className="flex items-center justify-between text-xs font-heading font-bold text-[#790B13]">
              <span className="bg-[#FFF0DC] text-[#790B13] border border-[#D6B77A]/30 px-3 py-1 rounded-full uppercase tracking-wider text-[10px]">
                {product.category?.name || 'Kathiyawadi Nasta'}
              </span>
              <span className="font-mono text-[#50000D] font-bold text-sm bg-[#FFF0DC] px-2.5 py-0.5 rounded-md">₹{product.pricePerKg}/kg</span>
            </div>

            <h1 className="font-editorial text-3xl sm:text-5xl text-[#50000D] font-bold tracking-tight">
              {language === 'gu' && product.nameGujarati ? product.nameGujarati : product.name}
            </h1>

            {/* Ratings summary */}
            <div className="flex items-center gap-2 pt-1 font-heading text-xs text-[#21191A]/70">
              <div className="flex text-[#D6B77A]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(product.ratings?.average || 5)
                        ? 'fill-[#D6B77A] text-[#D6B77A]'
                        : 'text-stone-300'
                    }`}
                  />
                ))}
              </div>
              <span className="font-bold text-[#50000D]">
                {product.ratings?.average > 0 ? product.ratings.average.toFixed(1) : '5.0'}
              </span>
              <span>•</span>
              <span>{reviews.length || product.ratings?.count || 12} Verified Customer Reviews</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-[#21191A]/80 font-sans leading-relaxed">
            {product.description}
          </p>

          {/* Weight Selection & Pricing Form */}
          <div className="p-6 bg-[#FFF9F2] rounded-3xl border border-[#D6B77A]/30 shadow-sm space-y-5 font-heading">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#50000D]">
              <span>Select Pack Weight:</span>
              <span className="text-[#790B13] text-[11px]">Dynamic Grams Pricing</span>
            </div>

            {/* Weight Options Grid */}
            <div className="grid grid-cols-2 xs:grid-cols-4 gap-2">
              {weightOptions.map((opt) => {
                const packCost = Math.round((product.pricePerKg * opt.weightGrams) / 1000);
                const isSel = selectedWeight === opt.weightGrams;
                return (
                  <button
                    key={opt.weightGrams}
                    type="button"
                    onClick={() => setSelectedWeight(opt.weightGrams)}
                    className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border text-center transition-all cursor-pointer min-h-[44px] ${
                      isSel
                        ? 'bg-[#50000D] text-[#FFF0DC] border-[#D6B77A]/40 shadow-xs'
                        : 'bg-[#FFF0DC]/60 text-[#21191A] border-[#D6B77A]/30 hover:border-[#790B13]'
                    }`}
                  >
                    <span className="block font-bold text-xs">{opt.label || `${opt.weightGrams}g`}</span>
                    <span className="block text-[11px] font-mono mt-0.5 opacity-90">
                      ₹{packCost}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quantity and Calculated Price */}
            <div className="pt-4 border-t border-[#D6B77A]/20 flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#21191A]/60 font-bold block">
                  Total Calculated Price:
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-[#790B13]">
                    ₹{totalPrice}
                  </span>
                  <span className="text-xs text-[#21191A]/60 font-sans">
                    ({quantity} × {selectedWeight >= 1000 ? `${selectedWeight / 1000}kg` : `${selectedWeight}g`})
                  </span>
                </div>
              </div>

              {/* Quantity Counter */}
              <div className="flex items-center border border-[#D6B77A]/40 rounded-full bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 px-3 text-[#21191A] hover:bg-[#FFF0DC] rounded-l-full cursor-pointer transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3 text-xs font-mono font-bold text-[#21191A]">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 px-3 text-[#21191A] hover:bg-[#FFF0DC] rounded-r-full cursor-pointer transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                className={`py-4 px-6 text-xs font-heading font-bold uppercase tracking-wider rounded-full flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${
                  addedNotice
                    ? 'bg-[#174D35] text-white'
                    : 'bg-[#50000D] hover:bg-[#790B13] text-[#FFF0DC] border border-[#D6B77A]/40'
                }`}
              >
                {addedNotice ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Added to Bag!</span>
                  </>
                ) : (
                  <span>Add to Bag • ₹{totalPrice}</span>
                )}
              </button>

              <a
                href={productWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-4 px-6 border border-[#D6B77A]/40 bg-white hover:bg-[#FFF0DC] text-[#50000D] rounded-full text-xs font-heading font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors text-center cursor-pointer shadow-xs"
              >
                <MessageCircle className="w-4 h-4 text-[#790B13]" />
                <span>WhatsApp Order</span>
              </a>
            </div>
          </div>

          {/* Technical Specs & Handling Details */}
          <div className="border border-[#D6B77A]/30 rounded-3xl p-6 bg-[#FFF0DC]/40 space-y-3.5 text-xs font-sans">
            <h2 className="font-heading font-bold text-xs uppercase tracking-wider text-[#50000D] border-b border-[#D6B77A]/20 pb-2.5 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#790B13]" /> Verified Quality & Preparation Dossier
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-[#21191A]/75">
              <div>
                <span className="font-heading font-bold text-[#50000D] uppercase tracking-wider text-[10px] block">Fresh Routine:</span>
                Fried fresh daily in Rajkot kitchen
              </div>
              <div>
                <span className="font-heading font-bold text-[#50000D] uppercase tracking-wider text-[10px] block">Shelf Life:</span>
                {product.shelfLife || '60 days from packaging'}
              </div>
              <div>
                <span className="font-heading font-bold text-[#50000D] uppercase tracking-wider text-[10px] block">Packaging Standard:</span>
                Moisture-sealed food-grade zip-lock pouch
              </div>
              <div>
                <span className="font-heading font-bold text-[#50000D] uppercase tracking-wider text-[10px] block">Groundnut Oil:</span>
                100% Saurashtra Sing-Tel (Unblended)
              </div>
            </div>
            {product.storageInstructions && (
              <p className="text-xs text-[#21191A]/75 pt-2 border-t border-[#D6B77A]/20">
                <span className="font-heading font-bold text-[#50000D] uppercase tracking-wider text-[10px]">Storage:</span> {product.storageInstructions}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Verified Reviews Section */}
      <section className="border-t border-[#D6B77A]/30 pt-14 space-y-8 font-sans">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-[#D6B77A]/20 pb-4">
          <div>
            <span className="font-heading text-xs font-bold uppercase tracking-widest text-[#790B13] block">
              Patron Testimonials
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-[#50000D] font-bold tracking-tight">
              Verified Customer Reviews ({reviews.length})
            </h2>
          </div>

          <button
            onClick={() => setShowReviewModal(true)}
            className="bg-[#50000D] hover:bg-[#790B13] text-[#FFF0DC] text-xs font-heading font-bold uppercase tracking-wider px-6 py-2.5 rounded-full border border-[#D6B77A]/40 transition-colors cursor-pointer shadow-xs"
          >
            Submit Review
          </button>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-12 text-[#21191A]/60 text-xs font-heading">
            No reviews registered yet. Be the first to submit verified feedback!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((rev) => (
              <div
                key={rev._id}
                className="p-6 bg-[#FFF9F2] rounded-3xl border border-[#D6B77A]/30 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex text-[#D6B77A]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating ? 'fill-[#D6B77A] text-[#D6B77A]' : 'text-stone-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-mono text-[10px] text-[#21191A]/60">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {rev.title && (
                  <h4 className="font-heading font-bold text-sm text-[#50000D]">{rev.title}</h4>
                )}
                <p className="text-xs text-[#21191A]/75 leading-relaxed font-sans">{rev.comment}</p>
                <div className="pt-2 border-t border-[#D6B77A]/20 flex items-center justify-between text-xs font-heading">
                  <span className="font-bold text-[#21191A]">{rev.userName}</span>
                  {rev.isVerifiedPurchase && (
                    <span className="text-[#50000D] bg-[#FFF0DC] border border-[#D6B77A]/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      ✓ Verified Buyer
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 font-sans">
          <div
            className="fixed inset-0 bg-[#3A000A]/75 backdrop-blur-sm"
            onClick={() => setShowReviewModal(false)}
          />

          <div className="relative bg-[#FFF9F2] border border-[#D6B77A]/30 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl z-10 animate-in fade-in duration-200">
            <div className="flex justify-between items-center border-b border-[#D6B77A]/20 pb-3 mb-4">
              <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-[#50000D]">
                Review {product.name}
              </h3>
              <button onClick={() => setShowReviewModal(false)} className="text-[#21191A]/60 hover:text-[#790B13]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {reviewMessage && (
              <div className="p-3 mb-4 bg-[#FFF0DC] rounded-xl text-xs font-heading font-bold text-[#50000D] border border-[#D6B77A]/30">
                {reviewMessage}
              </div>
            )}

            {!isAuthenticated ? (
              <div className="text-center py-6 font-heading">
                <p className="text-xs text-[#21191A]/70 mb-4">
                  Please log in to your account to submit a verified patron review.
                </p>
                <Link
                  to="/login"
                  className="bg-[#50000D] hover:bg-[#790B13] text-[#FFF0DC] text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-full inline-block shadow-sm"
                >
                  Log In
                </Link>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4 font-heading text-xs">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#21191A] mb-1">
                    Rating Score
                  </label>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="cursor-pointer"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= reviewRating
                              ? 'fill-[#D6B77A] text-[#D6B77A]'
                              : 'text-stone-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#21191A] mb-1">
                    Review Headline
                  </label>
                  <input
                    type="text"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    placeholder="e.g. Delicious Kathiyawadi crunch!"
                    className="w-full bg-white border border-[#D6B77A]/40 rounded-xl p-2.5 text-xs text-[#21191A] font-sans focus:outline-none focus:border-[#790B13]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#21191A] mb-1">
                    Detailed Critique
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Describe taste, spice balance, crispness, and aroma..."
                    className="w-full bg-white border border-[#D6B77A]/40 rounded-xl p-2.5 text-xs text-[#21191A] font-sans focus:outline-none focus:border-[#790B13]"
                  />
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="submit"
                    disabled={reviewSubmitting}
                    className="flex-1 bg-[#50000D] hover:bg-[#790B13] text-[#FFF0DC] py-3 rounded-full font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer border border-[#D6B77A]/40"
                  >
                    {reviewSubmitting ? 'Submitting...' : 'Post Verified Review'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(false)}
                    className="px-5 py-3 border border-[#D6B77A]/30 rounded-full text-[#21191A]/70 hover:text-[#50000D] font-bold uppercase tracking-wider cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-[#D6B77A]/30 pt-14 space-y-8 font-sans">
          <div className="flex items-center justify-between border-b border-[#D6B77A]/20 pb-4">
            <div>
              <span className="font-heading text-xs font-bold uppercase tracking-widest text-[#790B13] block">
                Complementary Varieties
              </span>
              <h2 className="font-editorial text-3xl text-[#50000D] font-bold tracking-tight">
                Related Gujarati Farsan
              </h2>
            </div>
            <Link
              to="/snacks"
              className="font-heading text-xs font-bold uppercase tracking-wider text-[#790B13] hover:text-[#50000D] flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetails;
