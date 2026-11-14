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
  Sparkles,
  ShieldCheck,
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
  const [showMobileFilters, setShowMobileFilters] = useState(false);

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 font-sans text-[#21191A]">
      
      {/* Editorial Header */}
      <div className="border-b border-[#D6B77A]/30 pb-10 mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-heading font-bold uppercase tracking-widest text-[#790B13] bg-[#FFF0DC] border border-[#D6B77A]/40 px-3.5 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-[#790B13]" />
              Rajkot Kitchen Direct • 100% Saurashtra Sing-Tel
            </div>
            
            <h1 className="font-editorial text-4xl sm:text-6xl text-[#50000D] font-bold tracking-tight">
              The Snack <span className="italic text-[#790B13]">Catalogue.</span>
            </h1>
            
            <p className="text-xs sm:text-sm text-[#21191A]/75 font-sans max-w-xl leading-relaxed">
              Prepared in 100% pure filtered groundnut oil with ancestral Kathiyawadi spices. Choose configurable 250g, 500g, 1kg or 2kg packs with transparent pricing.
            </p>
          </div>

          <div className="bg-[#FFF0DC] border border-[#D6B77A]/40 rounded-full px-5 py-2.5 text-xs font-heading font-bold uppercase tracking-wider text-[#50000D] self-start md:self-end shadow-xs">
            {totalCount} Varieties In Stock
          </div>
        </div>
      </div>

      {/* Mobile Filter Toggle Button */}
      <div className="lg:hidden flex items-center justify-between bg-[#FFF9F2] p-3.5 rounded-2xl border border-[#D6B77A]/30">
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="flex items-center gap-2 text-xs font-heading font-bold text-[#50000D] bg-[#FFF0DC] border border-[#D6B77A]/40 px-4 py-2.5 rounded-xl min-h-[44px] cursor-pointer"
        >
          <SlidersHorizontal className="w-4 h-4 text-[#790B13]" />
          <span>{showMobileFilters ? 'Hide Filters' : 'Filter & Refine Selection'}</span>
          {(category || searchTerm || minPrice || maxPrice) && (
            <span className="w-2 h-2 rounded-full bg-[#790B13]" />
          )}
        </button>
        <span className="text-xs text-[#21191A]/70 font-heading font-bold">
          {totalCount} snacks
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Filters */}
        <aside className={`${showMobileFilters ? 'block' : 'hidden'} lg:block bg-[#FFF9F2] p-6 sm:p-7 rounded-3xl border border-[#D6B77A]/30 shadow-sm space-y-6 h-fit font-heading`}>
          <div className="flex items-center justify-between pb-3.5 border-b border-[#D6B77A]/25">
            <h2 className="font-bold text-xs uppercase tracking-wider text-[#50000D]">
              Refine Selection
            </h2>
            <button
              onClick={handleResetFilters}
              className="text-xs text-[#790B13] hover:text-[#50000D] flex items-center gap-1 cursor-pointer transition-colors font-bold uppercase tracking-wider text-[10px]"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>

          {/* Search by Name */}
          <div className="space-y-2">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#21191A]">
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
                className="w-full bg-white border border-[#D6B77A]/40 rounded-full py-2.5 pl-4 pr-9 text-xs text-[#21191A] font-sans focus:outline-none focus:border-[#790B13]"
              />
              <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-[#790B13]" />
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-2.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#21191A]">
              Categories
            </label>
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => {
                  setCategory('');
                  setPage(1);
                }}
                className={`w-full text-left text-xs py-2 px-3.5 rounded-full transition-all cursor-pointer flex justify-between items-center ${
                  !category
                    ? 'bg-[#50000D] text-[#FFF0DC] font-bold shadow-xs border border-[#D6B77A]/40'
                    : 'text-[#21191A] hover:bg-[#FFF0DC]'
                }`}
              >
                <span>All Farsan</span>
                <span className="font-mono text-[11px] opacity-75">[{totalCount}]</span>
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  type="button"
                  onClick={() => {
                    setCategory(cat.slug);
                    setPage(1);
                  }}
                  className={`w-full text-left text-xs py-2 px-3.5 rounded-full transition-all cursor-pointer flex justify-between items-center ${
                    category === cat.slug
                      ? 'bg-[#50000D] text-[#FFF0DC] font-bold shadow-xs border border-[#D6B77A]/40'
                      : 'text-[#21191A] hover:bg-[#FFF0DC]'
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  <span className="font-mono text-[11px] opacity-75 shrink-0 ml-1">
                    [{cat.productCount}]
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#21191A]">
              Price / kg Range (₹)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Min ₹"
                className="w-full bg-white border border-[#D6B77A]/40 rounded-xl p-2 text-xs font-mono text-[#21191A] focus:outline-none focus:border-[#790B13]"
              />
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Max ₹"
                className="w-full bg-white border border-[#D6B77A]/40 rounded-xl p-2 text-xs font-mono text-[#21191A] focus:outline-none focus:border-[#790B13]"
              />
            </div>
          </div>

          {/* Quality Notice */}
          <div className="bg-[#FFF0DC] rounded-2xl p-4 text-xs font-sans text-[#21191A]/80 space-y-1.5 border border-[#D6B77A]/30">
            <span className="font-heading font-bold text-[#50000D] flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#790B13]" /> 100% Pure Sing-Tel
            </span>
            <p className="leading-relaxed text-[11px]">
              Never blended with palm oil. Made with freshly milled besan and natural Kathiyawadi spices.
            </p>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Top Sort & Summary Bar */}
          <div className="bg-[#FFF9F2] p-4 rounded-2xl border border-[#D6B77A]/30 shadow-xs flex flex-col sm:flex-row justify-between items-center gap-3 font-heading text-xs">
            <span className="text-[#21191A]/70">
              Showing <span className="font-bold text-[#50000D]">{products.length}</span> of {totalCount} authentic snacks
            </span>

            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#790B13]" />
              <span className="text-[#21191A]/70 font-bold uppercase tracking-wider text-[11px]">Sort:</span>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="bg-white border border-[#D6B77A]/40 rounded-full py-1.5 px-3.5 text-xs font-heading font-bold text-[#21191A] focus:outline-none focus:border-[#790B13]"
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
              <div className="w-8 h-8 border-2 border-[#790B13] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs text-[#21191A]/70 font-heading font-bold uppercase tracking-wider">Loading snack collection...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-[#FFF9F2] rounded-3xl p-16 text-center border border-[#D6B77A]/30 shadow-xs">
              <Package className="w-12 h-12 text-[#D6B77A] mx-auto mb-3" />
              <h3 className="font-heading font-bold text-[#50000D] text-base uppercase tracking-wider">
                No Snacks Matched Your Filters
              </h3>
              <p className="text-xs text-[#21191A]/70 mt-1 mb-5 max-w-xs mx-auto">
                Try clearing search terms or selecting another category.
              </p>
              <button
                onClick={handleResetFilters}
                className="bg-[#50000D] hover:bg-[#790B13] text-[#FFF0DC] text-xs font-heading font-bold uppercase tracking-wider px-6 py-2.5 rounded-full shadow-md transition-all cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
                className="px-4 py-2 border border-[#D6B77A]/30 bg-white text-[#21191A] rounded-full font-bold uppercase tracking-wider disabled:opacity-40 hover:bg-[#FFF0DC] transition-colors cursor-pointer"
              >
                Prev
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-9 h-9 rounded-full font-bold transition-colors cursor-pointer ${
                    page === i + 1
                      ? 'bg-[#50000D] text-[#FFF0DC] shadow-xs border border-[#D6B77A]/40'
                      : 'bg-white border border-[#D6B77A]/30 text-[#21191A] hover:border-[#790B13]'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 border border-[#D6B77A]/30 bg-white text-[#21191A] rounded-full font-bold uppercase tracking-wider disabled:opacity-40 hover:bg-[#FFF0DC] transition-colors cursor-pointer"
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
