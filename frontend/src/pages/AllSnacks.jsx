import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/product/ProductCard';
import QuickViewModal from '../components/common/QuickViewModal';
import { useLanguage } from '../context/LanguageContext';
import {
  SlidersHorizontal,
  Search,
  RotateCcw,
  Package,
  Leaf,
  Sparkles,
} from 'lucide-react';

const AllSnacks = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useLanguage();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Filter states
  const categoryParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('search') || '';
  const sortParam = searchParams.get('sort') || 'createdAt';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  const [category, setCategory] = useState(categoryParam);
  const [searchTerm, setSearchTerm] = useState(searchParam);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState(sortParam);
  const [page, setPage] = useState(pageParam);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Sync with URL params
  useEffect(() => {
    setCategory(searchParams.get('category') || '');
    setSearchTerm(searchParams.get('search') || '');
  }, [searchParams]);

  // Fetch categories
  useEffect(() => {
    api.get('/categories').then((res) => {
      if (res.success) setCategories(res.categories);
    });
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          page,
          limit: 12,
          sort,
        });

        if (category) queryParams.append('category', category);
        if (searchTerm) queryParams.append('search', searchTerm);
        if (minPrice) queryParams.append('minPrice', minPrice);
        if (maxPrice) queryParams.append('maxPrice', maxPrice);

        const data = await api.get(`/products?${queryParams.toString()}`);
        if (data.success) {
          setProducts(data.products);
          setTotalPages(data.totalPages);
          setTotalCount(data.total);
        }
      } catch (err) {
        console.error('Failed to load snacks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, searchTerm, minPrice, maxPrice, sort, page]);

  const handleResetFilters = () => {
    setCategory('');
    setSearchTerm('');
    setMinPrice('');
    setMaxPrice('');
    setSort('createdAt');
    setPage(1);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 font-sans text-[#1C1815]">
      {/* Header */}
      <div className="border-b border-[#EAE3D9] pb-8 mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-heading font-black uppercase tracking-wider text-[#14382B] bg-[#EBF4EF] px-3.5 py-1 rounded-full border border-[#14382B]/15">
              <Leaf className="w-3.5 h-3.5 text-[#14382B]" />
              Rajkot Kitchen Direct • 100% Sing-Tel Frying
            </div>
            <h1 className="font-heading font-black text-3xl sm:text-5xl text-[#14382B] tracking-tight">
              All Homemade <span className="text-[#C84B20]">Snacks & Farsan</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#6E675F] font-sans max-w-xl leading-relaxed">
              Fried fresh every morning in pure filtered groundnut oil. Flexible 250g, 500g, 1kg or 2kg packs with dynamic per-gram pricing.
            </p>
          </div>

          <div className="bg-white border border-[#EAE3D9] rounded-full px-5 py-2 text-xs font-heading font-bold text-[#14382B] self-start md:self-end shadow-xs">
            {totalCount} Items In Stock
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filter */}
        <aside className="bg-white p-6 rounded-3xl border border-[#EAE3D9] shadow-gourmet space-y-6 h-fit font-heading">
          <div className="flex items-center justify-between pb-3 border-b border-[#EAE3D9]">
            <h2 className="font-bold text-sm text-[#1C1815]">
              Filters & Search
            </h2>
            <button
              onClick={handleResetFilters}
              className="text-xs text-[#6E675F] hover:text-[#C84B20] flex items-center gap-1 cursor-pointer transition-colors font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>

          {/* Search by Name */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#1C1815]">
              Search Snack
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                placeholder="e.g. Tikha Gathiya..."
                className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-full py-2.5 pl-4 pr-9 text-xs text-[#1C1815] font-sans focus:outline-none focus:border-[#14382B]"
              />
              <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9C948B]" />
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#1C1815]">
              Categories
            </label>
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => {
                  setCategory('');
                  setPage(1);
                }}
                className={`w-full text-left text-xs py-2 px-3 rounded-full transition-colors cursor-pointer flex justify-between items-center ${
                  !category
                    ? 'bg-[#14382B] text-white font-bold shadow-xs'
                    : 'text-[#1C1815] hover:bg-[#FAF7F2]'
                }`}
              >
                <span>All Snacks</span>
                <span className="font-mono text-[11px] opacity-80">[{totalCount}]</span>
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  type="button"
                  onClick={() => {
                    setCategory(cat.slug);
                    setPage(1);
                  }}
                  className={`w-full text-left text-xs py-2 px-3 rounded-full transition-colors cursor-pointer flex justify-between items-center ${
                    category === cat.slug
                      ? 'bg-[#14382B] text-white font-bold shadow-xs'
                      : 'text-[#1C1815] hover:bg-[#FAF7F2]'
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  <span className="font-mono text-[11px] opacity-80 shrink-0 ml-1">
                    [{cat.productCount}]
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#1C1815]">
              Price / kg Range (₹)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Min ₹"
                className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl p-2 text-xs font-mono text-[#1C1815] focus:outline-none focus:border-[#14382B]"
              />
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Max ₹"
                className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl p-2 text-xs font-mono text-[#1C1815] focus:outline-none focus:border-[#14382B]"
              />
            </div>
          </div>

          {/* Quality Notice */}
          <div className="bg-[#EBF4EF] rounded-2xl p-4 text-xs font-sans text-[#6E675F] space-y-1 border border-[#14382B]/20">
            <span className="font-heading font-bold text-[#14382B] flex items-center gap-1.5">
              <Leaf className="w-3.5 h-3.5 text-[#14382B]" /> 100% Sing-Tel Guaranteed
            </span>
            <p className="leading-relaxed text-[11px]">
              Never blended with palm oil. Made with freshly ground besan and natural Kathiyawadi spices.
            </p>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Sort & Summary Bar */}
          <div className="bg-white p-4 rounded-2xl border border-[#EAE3D9] shadow-xs flex flex-col sm:flex-row justify-between items-center gap-3 font-heading text-xs">
            <span className="text-[#6E675F]">
              Showing <span className="font-bold text-[#1C1815]">{products.length}</span> of {totalCount} authentic snacks
            </span>

            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#6E675F]" />
              <span className="text-[#6E675F] font-bold">Sort:</span>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="bg-[#FAF7F2] border border-[#EAE3D9] rounded-full py-1.5 px-3 text-xs font-heading font-bold text-[#1C1815] focus:outline-none focus:border-[#14382B]"
              >
                <option value="createdAt">Newest / Featured</option>
                <option value="price_asc">Price per kg: Low to High</option>
                <option value="price_desc">Price per kg: High to Low</option>
                <option value="rating">Customer Rating</option>
                <option value="name_asc">Name: A to Z</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="py-24 text-center">
              <div className="w-8 h-8 border-2 border-[#14382B] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs text-[#6E675F] font-heading font-bold">Loading snacks catalog...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 text-center border border-[#EAE3D9] shadow-xs">
              <Package className="w-12 h-12 text-[#9C948B] mx-auto mb-3" />
              <h3 className="font-heading font-bold text-[#1C1815] text-base">
                No Snacks Matched Your Filters
              </h3>
              <p className="text-xs text-[#6E675F] mt-1 mb-5 max-w-xs mx-auto">
                Try clearing search terms or selecting another category.
              </p>
              <button
                onClick={handleResetFilters}
                className="bg-[#C84B20] hover:bg-[#A33A16] text-white text-xs font-heading font-bold px-6 py-2.5 rounded-full shadow-warm-glow transition-all cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onQuickView={(p) => setQuickViewProduct(p)}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-8 font-heading text-xs">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="px-4 py-2 border border-[#EAE3D9] bg-white text-[#1C1815] rounded-full font-bold disabled:opacity-40 hover:bg-[#FAF7F2] transition-colors cursor-pointer"
              >
                Prev
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-9 h-9 rounded-full font-bold transition-colors cursor-pointer ${
                    page === i + 1
                      ? 'bg-[#14382B] text-white shadow-xs'
                      : 'bg-white border border-[#EAE3D9] text-[#1C1815] hover:border-[#14382B]'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 border border-[#EAE3D9] bg-white text-[#1C1815] rounded-full font-bold disabled:opacity-40 hover:bg-[#FAF7F2] transition-colors cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
};

export default AllSnacks;
