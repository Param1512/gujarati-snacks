import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/product/ProductCard';
import QuickViewModal from '../components/common/QuickViewModal';
import { Heart, ArrowRight, Sparkles } from 'lucide-react';

const Wishlist = () => {
  const { wishlistProductIds } = useWishlist();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    if (wishlistProductIds.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    api
      .get('/products?limit=50')
      .then((res) => {
        if (res.success) {
          const filtered = res.products.filter((p) => wishlistProductIds.includes(p._id));
          setProducts(filtered);
        }
      })
      .finally(() => setLoading(false));
  }, [wishlistProductIds]);

  return (
    <div className="min-h-screen bg-[#FFF9F2] py-12 sm:py-20 text-[#21191A] font-sans selection:bg-[#790B13] selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#D6B77A]/20 pb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0DC] border border-[#D6B77A]/40 text-[#790B13] text-xs font-mono uppercase tracking-widest mb-2 shadow-xs">
              <Heart className="w-3.5 h-3.5 text-[#790B13] fill-[#790B13]" />
              <span>Personal Saved Archive</span>
            </div>
            <h1 className="font-heading font-black text-3xl sm:text-5xl text-[#21191A] uppercase tracking-tight">
              My Saved <span className="font-serif italic font-normal lowercase text-[#790B13]">snacks</span>
            </h1>
          </div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#790B13] bg-white border border-[#D6B77A]/40 px-5 py-2 rounded-full w-fit shadow-xs font-bold">
            {products.length} {products.length === 1 ? 'snack saved' : 'snacks saved'}
          </span>
        </div>

        {loading ? (
          <div className="py-24 text-center">
            <div className="w-10 h-10 border-2 border-[#790B13] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-mono uppercase tracking-widest text-[#790B13]">Accessing Archive...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white p-10 sm:p-14 text-center rounded-3xl border border-[#D6B77A]/30 max-w-md mx-auto space-y-5 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#FFF0DC] text-[#790B13] flex items-center justify-center mx-auto shadow-xs border border-[#D6B77A]/40">
              <Heart className="w-8 h-8 fill-[#790B13]" />
            </div>
            <h2 className="font-heading font-black text-2xl uppercase tracking-tight text-[#21191A]">
              Your Wishlist is Empty
            </h2>
            <p className="text-xs sm:text-sm text-[#21191A]/70 font-sans leading-relaxed">
              Select the bookmark heart on any Gujarati snack card to curate your bespoke personal collection for rapid reorders.
            </p>
            <div className="pt-2">
              <Link
                to="/snacks"
                className="bg-[#790B13] hover:bg-[#50000D] text-[#FFF0DC] text-xs font-mono uppercase tracking-widest font-bold px-8 py-4 rounded-full inline-flex items-center gap-2 transition-all shadow-lg shadow-[#790B13]/20 active:scale-98 cursor-pointer group"
              >
                <span>Explore Snacks</span>
                <ArrowRight className="w-4 h-4 text-[#D6B77A] group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>
        )}

        {quickViewProduct && (
          <QuickViewModal
            product={quickViewProduct}
            onClose={() => setQuickViewProduct(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Wishlist;
