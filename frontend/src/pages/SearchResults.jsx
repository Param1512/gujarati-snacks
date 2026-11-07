import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/product/ProductCard';
import QuickViewModal from '../components/common/QuickViewModal';
import { Search } from 'lucide-react';

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
    <div className="min-h-screen bg-[#FAF7F2] py-10 sm:py-16 text-[#000000]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#EAE3D9] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#14382B] text-[#000000] text-xs font-bold mb-2 shadow-xs">
              <Search className="w-3.5 h-3.5 text-[#C84B20]" />
              <span>Catalogue Search</span>
            </div>
            <h1 className="font-heading font-black text-3xl sm:text-4xl text-[#000000] tracking-tight">
              {query ? `Snacks Matching "${query}"` : 'Catalogue Search'}
            </h1>
          </div>
          <span className="text-xs font-bold text-[#000000] bg-white border border-[#EAE3D9] px-4 py-1.5 rounded-full w-fit">
            {products.length} {products.length === 1 ? 'snack found' : 'snacks found'}
          </span>
        </div>

        {loading ? (
          <div className="py-24 text-center">
            <div className="w-10 h-10 border-3 border-[#000000] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-bold text-[#555555]">Searching Kitchen Catalogue...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-[#EBF4EF] p-10 sm:p-14 text-center rounded-3xl border border-[#14382B]/60 max-w-lg mx-auto space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-white text-[#555555] flex items-center justify-center mx-auto shadow-xs border border-[#EAE3D9]">
              <Search className="w-8 h-8 text-[#000000]" />
            </div>
            <h3 className="font-heading font-bold text-xl text-[#000000]">
              No Snacks Found For "{query}"
            </h3>
            <p className="text-xs sm:text-sm text-[#555555] font-sans leading-relaxed">
              Please check for alternative spellings or explore our popular Kathiyawadi staples like Tikha Gathiya, Poha Chevdo, or Chakdi.
            </p>
            <div className="pt-2">
              <Link
                to="/snacks"
                className="bg-[#C84B20] hover:bg-[#A33A16] text-white text-xs sm:text-sm font-semibold px-6 py-3 rounded-full inline-flex items-center gap-2 transition-all shadow-md shadow-[#C84B20]/25 active:scale-98 cursor-pointer"
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
