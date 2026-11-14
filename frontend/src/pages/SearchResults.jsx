import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/product/ProductCard';
import QuickViewModal from '../components/common/QuickViewModal';
import { Search, Sparkles } from 'lucide-react';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    if (!query) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    api
      .get(`/products?search=${encodeURIComponent(query)}`)
      .then((data) => {
        if (data.success) {
          setProducts(data.products);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <div className="min-h-screen bg-[#FFF9F2] py-12 sm:py-16 text-[#21191A] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#D6B77A]/30 pb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFF0DC] text-[#790B13] border border-[#D6B77A]/40 text-xs font-heading font-bold uppercase tracking-wider mb-2 shadow-xs">
              <Search className="w-3.5 h-3.5 text-[#790B13]" />
              <span>Catalogue Search</span>
            </div>
            <h1 className="font-editorial text-3xl sm:text-5xl text-[#50000D] font-bold tracking-tight">
              {query ? `Snacks Matching "${query}"` : 'Catalogue Search'}
            </h1>
          </div>
          <span className="text-xs font-heading font-bold uppercase tracking-wider text-[#50000D] bg-[#FFF0DC] border border-[#D6B77A]/30 px-4 py-2 rounded-full w-fit">
            {products.length} {products.length === 1 ? 'snack found' : 'snacks found'}
          </span>
        </div>

        {loading ? (
          <div className="py-24 text-center">
            <div className="w-8 h-8 border-2 border-[#790B13] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-heading font-bold uppercase tracking-wider text-[#21191A]/70">Searching Kitchen Catalogue...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-[#FFF0DC]/50 p-10 sm:p-14 text-center rounded-3xl border border-[#D6B77A]/40 max-w-lg mx-auto space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-white text-[#790B13] flex items-center justify-center mx-auto shadow-xs border border-[#D6B77A]/30">
              <Search className="w-7 h-7 text-[#790B13]" />
            </div>
            <h3 className="font-heading font-bold text-xl text-[#50000D]">
              No Snacks Found For "{query}"
            </h3>
            <p className="text-xs sm:text-sm text-[#21191A]/70 font-sans leading-relaxed">
              Please check for alternative spellings or explore our popular Kathiyawadi staples like Tikha Gathiya, Plain Poha Chevdo, or Chakdi.
            </p>
            <div className="pt-2">
              <Link
                to="/snacks"
                className="bg-[#50000D] hover:bg-[#790B13] text-[#FFF0DC] border border-[#D6B77A]/40 text-xs font-heading font-bold uppercase tracking-wider px-6 py-3 rounded-full inline-flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <span>Explore All Snacks →</span>
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

export default SearchResults;
