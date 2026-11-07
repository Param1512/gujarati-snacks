import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/product/ProductCard';
import QuickViewModal from '../components/common/QuickViewModal';
import { Heart, ArrowRight } from 'lucide-react';

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
    <div className="min-h-screen bg-[#FAF7F2] py-10 sm:py-16 text-[#000000]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#EAE3D9] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#14382B] text-[#000000] text-xs font-bold mb-2 shadow-xs">
              <Heart className="w-3.5 h-3.5 text-[#C84B20] fill-[#C84B20]" />
              <span>Personal Saved Registry</span>
            </div>
            <h1 className="font-heading font-black text-3xl sm:text-4xl text-[#000000] tracking-tight">
              My Saved Snacks
            </h1>
          </div>
          <span className="text-xs font-bold text-[#000000] bg-white border border-[#EAE3D9] px-4 py-1.5 rounded-full w-fit">
            {products.length} {products.length === 1 ? 'snack saved' : 'snacks saved'}
          </span>
        </div>

        {loading ? (
          <div className="py-24 text-center">
            <div className="w-10 h-10 border-3 border-[#000000] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-bold text-[#555555]">Loading Saved Items...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-[#EBF4EF] p-10 sm:p-14 text-center rounded-3xl border border-[#14382B]/60 max-w-md mx-auto space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-white text-[#C84B20] flex items-center justify-center mx-auto shadow-xs border border-[#EAE3D9]">
              <Heart className="w-8 h-8 fill-[#C84B20]" />
            </div>
            <h2 className="font-heading font-bold text-xl text-[#000000]">
              Your Wishlist is Empty
            </h2>
            <p className="text-xs sm:text-sm text-[#555555] font-sans leading-relaxed">
              Click the bookmark heart on any Gujarati snack card to save it for quick future ordering.
            </p>
            <div className="pt-2">
              <Link
                to="/snacks"
                className="bg-[#C84B20] hover:bg-[#A33A16] text-white text-xs sm:text-sm font-semibold px-6 py-3 rounded-full inline-flex items-center gap-2 transition-all shadow-md shadow-[#C84B20]/25 active:scale-98 cursor-pointer"
              >
                <span>Explore Snacks →</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
