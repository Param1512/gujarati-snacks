import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/product/ProductCard';
import QuickViewModal from '../components/common/QuickViewModal';
import { useLanguage } from '../context/LanguageContext';
import { useSettings } from '../context/SettingsContext';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Flame,
  Award,
  Truck,
  CheckCircle,
  Star,
  Layers,
  Heart,
  Clock,
  Package,
} from 'lucide-react';

const Home = () => {
  const { t, language } = useLanguage();
  const { settings } = useSettings();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [activeCategorySlug, setActiveCategorySlug] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodData, catData] = await Promise.all([
          api.get('/products?limit=12'),
          api.get('/categories'),
        ]);

        if (prodData.success) {
          setProducts(prodData.products);
        }
        if (catData.success) {
          setCategories(catData.categories);
        }
      } catch (err) {
        console.error('Failed to load homepage snacks data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const bestsellers = products.filter((p) => p.isBestseller);
  const filteredProducts = activeCategorySlug === 'all'
    ? products
    : products.filter((p) => p.category?.slug === activeCategorySlug || p.categorySlug === activeCategorySlug);

  return (
    <div className="space-y-16 sm:space-y-24 lg:space-y-32 pb-24 overflow-hidden">
      
      {/* ========================================================
          1. IMMERSIVE HERO SECTION
          Deep Burgundy (#50000D / #790B13), Warm Ivory Typography,
          Asymmetric High-End Editorial Composition
          ======================================================== */}
      <section className="relative bg-gradient-to-br from-[#50000D] via-[#790B13] to-[#3A000A] text-[#FFF0DC] pt-16 pb-24 lg:pt-24 lg:pb-32 overflow-hidden border-b border-[#D6B77A]/30">
        {/* Subtle Luxury Pattern Overlay */}
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#D6B77A_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        
        {/* Ambient Gradient Highlights */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#D6B77A]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#C98789]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Bold Oversized Editorial Typography */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              
              <div className="inline-flex items-center gap-2 bg-[#FFF0DC]/10 text-[#D6B77A] border border-[#D6B77A]/30 px-4 py-1.5 rounded-full text-xs font-heading font-bold uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5 text-[#D6B77A]" />
                Handcrafted in Rajkot • 100% Saurashtra Sing-Tel
              </div>

              <div className="space-y-4">
                <h1 className="font-heading font-bold text-4xl sm:text-6xl lg:text-7xl tracking-tight text-[#FFF0DC] leading-[1.05]">
                  THE ART OF <br />
                  <span className="font-editorial italic font-normal text-[#D6B77A]">Gujarati Taste.</span>
                </h1>
                
                <p className="text-base sm:text-lg text-[#FFF0DC]/85 max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans">
                  Traditional homemade snacks, crafted with care and inspired by the flavours of home. Prepared in pure filtered groundnut oil with ancestral Kathiyawadi spices.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/snacks"
                  className="bg-[#D6B77A] hover:bg-[#E9D8C3] text-[#50000D] font-heading font-bold text-xs uppercase tracking-widest px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center gap-3 cursor-pointer"
                >
                  <span>EXPLORE OUR COLLECTION</span>
                  <ArrowRight className="w-4 h-4 text-[#50000D]" />
                </Link>

                <Link
                  to="/combo-builder"
                  className="bg-[#3A000A]/80 hover:bg-[#50000D] text-[#FFF0DC] font-heading font-bold text-xs uppercase tracking-widest px-7 py-4 rounded-full border border-[#D6B77A]/40 shadow-md transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#D6B77A]" />
                  <span>CUSTOM SNACK BOX</span>
                </Link>
              </div>

              {/* Quality & Trust Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-6 sm:pt-8 border-t border-[#D6B77A]/20 text-[11px] sm:text-xs font-heading uppercase tracking-wider text-[#FFF0DC]/80">
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <ShieldCheck className="w-4 h-4 text-[#D6B77A] shrink-0" />
                  <span>100% Sing-Tel</span>
                </div>
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <Flame className="w-4 h-4 text-[#D6B77A] shrink-0" />
                  <span>Authentic Homemade</span>
                </div>
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <Package className="w-4 h-4 text-[#D6B77A] shrink-0" />
                  <span>250g to 2kg Packs</span>
                </div>
              </div>

            </div>

            {/* Right Column: Asymmetric Showcase of Signature Food Art */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative max-w-md w-full">
                
                {/* Decorative Champagne Gold Border Frame */}
                <div className="absolute -inset-3 rounded-3xl border border-[#D6B77A]/30 transform rotate-2 pointer-events-none" />

                <div className="relative bg-[#FFF9F2] p-5 sm:p-7 rounded-3xl shadow-2xl text-[#21191A] border border-[#D6B77A]/40">
                  
                  {/* Signature Pill */}
                  <div className="absolute -top-3.5 right-6 bg-[#50000D] text-[#D6B77A] border border-[#D6B77A]/40 text-[10px] font-heading font-bold uppercase tracking-widest px-3.5 py-1 rounded-full shadow-md">
                    ★ Signature Kathiyawadi
                  </div>

                  <div className="aspect-4/3 rounded-2xl overflow-hidden bg-[#FFF0DC]/50 mb-5 border border-[#D6B77A]/25 relative">
                    <img
                      src="/images/snacks/tikha-gathiya.jpg"
                      alt="Authentic Kathiyawadi Tikha Gathiya"
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute bottom-2.5 left-2.5 bg-[#50000D]/80 backdrop-blur-xs text-[#FFF0DC] text-[10px] font-heading font-bold px-2.5 py-1 rounded-md">
                      100% Pure Sing-Tel
                    </div>
                  </div>

                  <div className="flex justify-between items-start mb-1.5">
                    <div>
                      <span className="text-[10px] font-heading font-bold text-[#790B13] uppercase tracking-wider block">
                        Gathiya & Farsan
                      </span>
                      <h3 className="font-heading font-bold text-xl sm:text-2xl text-[#50000D]">
                        Tikha Gathiya
                      </h3>
                    </div>
                    <span className="font-heading font-black text-xl text-[#790B13]">₹500/kg</span>
                  </div>

                  <p className="text-xs text-[#21191A]/70 mb-5 leading-relaxed">
                    Spicy, melt-in-mouth Kathiyawadi besan strips infused with cracked black pepper (mari), ajwain, and pure groundnut oil.
                  </p>

                  <div className="bg-[#FFF0DC] p-3 rounded-xl flex items-center justify-between mb-5 text-xs font-heading">
                    <span className="text-[#21191A]/70 uppercase tracking-wider font-bold text-[10px]">Select Weight:</span>
                    <span className="text-[#50000D] font-bold">250g • 500g • 1kg • 2kg</span>
                  </div>

                  <Link
                    to="/snacks/tikha-gathiya"
                    className="w-full bg-[#50000D] hover:bg-[#790B13] text-[#FFF0DC] border border-[#D6B77A]/40 py-3 rounded-xl text-center text-xs font-heading font-bold uppercase tracking-widest block transition-all shadow-sm"
                  >
                    ORDER TIKHA GATHIYA
                  </Link>

                </div>

              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ========================================================
          2. DISTINCTIVE CATEGORY SHOWCASE
          Large Photographic Tiles with Asymmetric Editorial Layout
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 pb-4 border-b border-[#D6B77A]/25">
          <div>
            <span className="font-heading text-xs font-bold uppercase tracking-widest text-[#790B13]">
              Authentic Farsan Collections
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-[#50000D] font-bold mt-1">
              Explore By Category
            </h2>
          </div>
          <Link
            to="/categories"
            className="text-xs font-heading font-bold uppercase tracking-wider text-[#790B13] hover:text-[#50000D] flex items-center gap-1.5 transition-colors"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Asymmetrical Grid of Photographic Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-6">
          {categories.map((cat, idx) => (
            <Link
              key={cat._id}
              to={`/snacks?category=${cat.slug}`}
              className="group relative bg-[#FFF9F2] rounded-3xl overflow-hidden border border-[#D6B77A]/30 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5"
            >
              {/* Category Image */}
              <div className="aspect-square overflow-hidden bg-[#FFF0DC]/40 relative">
                <img
                  src={cat.imageUrl || '/images/snacks/tikha-gathiya.jpg'}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#3A000A]/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                <span className="absolute bottom-3 left-3 bg-[#50000D]/85 backdrop-blur-xs text-[#FFF0DC] text-[10px] font-heading font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-[#D6B77A]/30">
                  {cat.productCount || 0} Varieties
                </span>
              </div>

              {/* Title & Description */}
              <div className="p-4 text-center">
                <h3 className="font-heading font-bold text-sm text-[#50000D] group-hover:text-[#790B13] transition-colors">
                  {language === 'gu' && cat.nameGujarati ? cat.nameGujarati : cat.name}
                </h3>
                <p className="text-[11px] text-[#21191A]/60 line-clamp-1 mt-1 font-sans">
                  {cat.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>


      {/* ========================================================
          3. BESTSELLING SNACKS SHOWCASE
          Dynamic Products Loaded from MongoDB with Live Weight Selector
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 pb-4 border-b border-[#D6B77A]/25">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-heading font-bold uppercase tracking-widest text-[#790B13] mb-1">
              <Flame className="w-3.5 h-3.5 text-[#790B13]" /> Time-Honoured Favourites
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl text-[#50000D] font-bold">
              Bestselling Snacks
            </h2>
          </div>
          <Link
            to="/snacks"
            className="text-xs font-heading font-bold uppercase tracking-wider text-[#790B13] hover:text-[#50000D] flex items-center gap-1.5 transition-colors"
          >
            <span>View All ({products.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {bestsellers.slice(0, 4).map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>
      </section>


      {/* ========================================================
          4. INTERACTIVE CUSTOM SNACK COMBO TEASER
          Asymmetrical Luxury Feature Section
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#50000D] to-[#790B13] rounded-3xl p-8 sm:p-14 text-[#FFF0DC] relative overflow-hidden shadow-2xl border border-[#D6B77A]/40">
          
          {/* Subtle Decorative Pattern */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10 bg-[radial-gradient(#D6B77A_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          <div className="max-w-xl space-y-5 relative z-10">
            <span className="inline-flex items-center gap-1.5 bg-[#FFF0DC]/10 text-[#D6B77A] border border-[#D6B77A]/30 px-3.5 py-1 rounded-full text-xs font-heading font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-[#D6B77A]" /> Customise Your Hamper
            </span>
            
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-[#FFF0DC] leading-tight">
              Create Your Custom <br />
              <span className="font-editorial italic font-normal text-[#D6B77A]">Snack Dabba Box</span>
            </h2>
            
            <p className="text-sm text-[#FFF0DC]/85 leading-relaxed font-sans">
              Why settle for one snack? Combine 250g Tikha Gathiya, 500g Plain Poha Chevdo, and 250g Sev Mamra into your bespoke gift hamper with real-time transparent weight and price calculations.
            </p>
            
            <div className="pt-2">
              <Link
                to="/combo-builder"
                className="bg-[#D6B77A] hover:bg-[#E9D8C3] text-[#50000D] font-heading font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-full shadow-lg transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <span>LAUNCH COMBO BUILDER</span>
                <ArrowRight className="w-4 h-4 text-[#50000D]" />
              </Link>
            </div>
          </div>

          <div className="hidden lg:block absolute -right-6 -bottom-6 w-72 h-72 rounded-full overflow-hidden border-4 border-[#D6B77A]/30 shadow-2xl opacity-90">
            <img
              src="/images/snacks/tea-time-combo.jpg"
              alt="Kathiyawadi Tea Time Combo Platter"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>


      {/* ========================================================
          5. COMPLETE HOMEMADE SNACKS CATALOGUE PREVIEW
          Category Pill Filter Tabs + Responsive Grid
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="font-heading text-xs font-bold uppercase tracking-widest text-[#790B13]">
            Traditional Taste & Heritage
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl text-[#50000D] font-bold">
            Homemade Gujarati Farsan
          </h2>
          <p className="text-xs sm:text-sm text-[#21191A]/70">
            Every batch is hand-prepared with stone-ground besan, roasted Kathiyawadi spices, and 100% pure filtered groundnut oil. Select any weight from 250g to 2kg.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          <button
            onClick={() => setActiveCategorySlug('all')}
            className={`px-4 py-2 rounded-full text-xs font-heading font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeCategorySlug === 'all'
                ? 'bg-[#50000D] text-[#FFF0DC] shadow-sm'
                : 'bg-[#FFF0DC]/70 text-[#21191A]/80 hover:bg-[#FFF0DC] border border-[#D6B77A]/30'
            }`}
          >
            All Snacks ({products.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setActiveCategorySlug(cat.slug)}
              className={`px-4 py-2 rounded-full text-xs font-heading font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeCategorySlug === cat.slug
                  ? 'bg-[#50000D] text-[#FFF0DC] shadow-sm'
                  : 'bg-[#FFF0DC]/70 text-[#21191A]/80 hover:bg-[#FFF0DC] border border-[#D6B77A]/30'
              }`}
            >
              {language === 'gu' && cat.nameGujarati ? cat.nameGujarati : cat.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/snacks"
            className="inline-flex items-center gap-2 bg-[#50000D] hover:bg-[#790B13] text-[#FFF0DC] border border-[#D6B77A]/40 font-heading font-bold text-xs uppercase tracking-widest px-8 py-4 rounded-full shadow-md transition-all"
          >
            <span>VIEW COMPLETE SNACK CATALOGUE</span>
            <ArrowRight className="w-4 h-4 text-[#D6B77A]" />
          </Link>
        </div>
      </section>


      {/* ========================================================
          6. THE BRAND STORY: ANCESTRAL HERITAGE
          "MORE THAN JUST SNACKS. A TASTE OF HOME."
          Deep Burgundy & Warm Ivory Editorial Contrast
          ======================================================== */}
      <section className="bg-[#FFF0DC] py-20 lg:py-28 border-y border-[#D6B77A]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Story Content */}
            <div className="lg:col-span-6 space-y-6">
              <span className="font-heading text-xs font-bold uppercase tracking-widest text-[#790B13] bg-white px-3.5 py-1.5 rounded-full border border-[#D6B77A]/40">
                Heritage of Saurashtra
              </span>
              
              <h2 className="font-editorial text-3xl sm:text-5xl text-[#50000D] font-bold leading-tight">
                More Than Just Snacks. <br />
                <span className="italic text-[#790B13]">A Taste of Home.</span>
              </h2>
              
              <p className="text-sm text-[#21191A]/80 leading-relaxed font-sans">
                In Gujarat, evening teatime is sacred. For generations, our family kitchen in Rajkot has honored traditional preparation, using pure, golden Saurashtra groundnut oil (Sing-Tel) in heavy brass and iron kadhais.
              </p>
              
              <p className="text-sm text-[#21191A]/80 leading-relaxed font-sans">
                We never use palm oil, artificial colors, or chemical preservatives. Our besan is freshly milled, our black pepper is cracked in-house, and our ajwain is hand-cleaned. When you open a pack, the fragrant, nutty aroma of pure Kathiyawadi farsan fills the room.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-3">
                <div className="bg-white p-5 rounded-2xl border border-[#D6B77A]/30 shadow-xs">
                  <span className="block font-heading font-black text-3xl text-[#50000D]">100%</span>
                  <span className="font-heading text-xs font-bold uppercase tracking-wider text-[#21191A]">Pure Groundnut Oil</span>
                  <p className="text-[11px] text-[#21191A]/60 mt-1 font-sans">Zero palm oil, zero adulteration</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-[#D6B77A]/30 shadow-xs">
                  <span className="block font-heading font-black text-3xl text-[#790B13]">Pure</span>
                  <span className="font-heading text-xs font-bold uppercase tracking-wider text-[#21191A]">Ancestral Taste</span>
                  <p className="text-[11px] text-[#21191A]/60 mt-1 font-sans">Traditional Kathiyawadi recipes</p>
                </div>
              </div>
            </div>

            {/* Visual Photography Composition */}
            <div className="lg:col-span-6">
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-5">
                  <div className="rounded-3xl overflow-hidden border border-[#D6B77A]/40 shadow-lg aspect-4/5">
                    <img
                      src="/images/snacks/tikha-gathiya.jpg"
                      alt="Fresh Tikha Gathiya"
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="bg-[#50000D] text-[#FFF0DC] p-5 rounded-2xl text-center border border-[#D6B77A]/30">
                    <p className="font-editorial text-lg font-bold text-[#D6B77A]">Rajkot, Gujarat</p>
                    <p className="text-[11px] text-[#FFF0DC]/80 font-heading uppercase tracking-wider mt-0.5">Heritage Kathiyawadi Taste</p>
                  </div>
                </div>

                <div className="space-y-5 pt-8">
                  <div className="bg-[#790B13] text-[#FFF0DC] p-5 rounded-2xl text-center border border-[#D6B77A]/30">
                    <p className="font-heading font-bold text-sm text-[#FFF0DC] uppercase tracking-wider">4 Configurable Weights</p>
                    <p className="text-xs text-[#D6B77A] font-sans mt-0.5">250g • 500g • 1kg • 2kg</p>
                  </div>
                  <div className="rounded-3xl overflow-hidden border border-[#D6B77A]/40 shadow-lg aspect-4/5">
                    <img
                      src="/images/snacks/plain-poha-chevdo.jpg"
                      alt="Roasted Poha Chevdo"
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ========================================================
          7. QUALITY & VERIFIED TRUST SECTION
          Verified Pillars: Pure Sing-Tel, Authentic Spices, Freshness
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-14 space-y-2">
          <span className="font-heading text-xs font-bold uppercase tracking-widest text-[#790B13]">
            Uncompromising Standards
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl text-[#50000D] font-bold">
            Our Homemade Quality Promise
          </h2>
          <p className="text-xs sm:text-sm text-[#21191A]/70">
            Every bite carries the integrity of traditional Gujarati craftsmanship.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#FFF9F2] p-6 rounded-3xl border border-[#D6B77A]/30 text-center space-y-3">
            <div className="w-12 h-12 bg-[#FFF0DC] text-[#790B13] rounded-2xl flex items-center justify-center mx-auto border border-[#D6B77A]/30">
              <ShieldCheck className="w-6 h-6 text-[#790B13]" />
            </div>
            <h3 className="font-heading font-bold text-sm text-[#50000D] uppercase tracking-wider">100% Pure Sing-Tel</h3>
            <p className="text-xs text-[#21191A]/70 leading-relaxed font-sans">
              Fried exclusively in Saurashtra filtered groundnut oil. We strictly prohibit palm oil or blended oils.
            </p>
          </div>

          <div className="bg-[#FFF9F2] p-6 rounded-3xl border border-[#D6B77A]/30 text-center space-y-3">
            <div className="w-12 h-12 bg-[#FFF0DC] text-[#790B13] rounded-2xl flex items-center justify-center mx-auto border border-[#D6B77A]/30">
              <Flame className="w-6 h-6 text-[#790B13]" />
            </div>
            <h3 className="font-heading font-bold text-sm text-[#50000D] uppercase tracking-wider">Traditional Preparation</h3>
            <p className="text-xs text-[#21191A]/70 leading-relaxed font-sans">
              Prepared with care using authentic Kathiyawadi methods. Crisp, flavorful namkeen sealed for optimal freshness.
            </p>
          </div>

          <div className="bg-[#FFF9F2] p-6 rounded-3xl border border-[#D6B77A]/30 text-center space-y-3">
            <div className="w-12 h-12 bg-[#FFF0DC] text-[#790B13] rounded-2xl flex items-center justify-center mx-auto border border-[#D6B77A]/30">
              <Package className="w-6 h-6 text-[#790B13]" />
            </div>
            <h3 className="font-heading font-bold text-sm text-[#50000D] uppercase tracking-wider">Moisture-Proof Seal</h3>
            <p className="text-xs text-[#21191A]/70 leading-relaxed font-sans">
              Packed in food-grade zip-lock pouches to lock in aroma, crunch, and authentic Kathiyawadi flavour.
            </p>
          </div>

          <div className="bg-[#FFF9F2] p-6 rounded-3xl border border-[#D6B77A]/30 text-center space-y-3">
            <div className="w-12 h-12 bg-[#FFF0DC] text-[#790B13] rounded-2xl flex items-center justify-center mx-auto border border-[#D6B77A]/30">
              <Award className="w-6 h-6 text-[#790B13]" />
            </div>
            <h3 className="font-heading font-bold text-sm text-[#50000D] uppercase tracking-wider">Ancestral Recipes</h3>
            <p className="text-xs text-[#21191A]/70 leading-relaxed font-sans">
              Balanced spices, stone-ground hing, and hand-cleaned ajwain perfected across three generations.
            </p>
          </div>
        </div>
      </section>


      {/* ========================================================
          8. CUSTOMER TESTIMONIALS
          Genuine Patron Reflections
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-14 space-y-2">
          <span className="font-heading text-xs font-bold uppercase tracking-widest text-[#790B13]">
            Patron Reviews
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl text-[#50000D] font-bold">
            Loved Across Saurashtra & Beyond
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#FFF9F2] p-8 rounded-3xl border border-[#D6B77A]/30 space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex text-[#D6B77A]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#D6B77A]" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-[#21191A]/80 italic leading-relaxed font-editorial">
                "Finding authentic Kathiyawadi Tikha Gathiya made in pure Sing-Tel outside Rajkot was impossible until I ordered from Gujarati Nasta. The crunch and pepper heat are extraordinary."
              </p>
            </div>
            <div className="border-t border-[#D6B77A]/20 pt-4">
              <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-[#50000D]">Bhavik Mehta</h4>
              <span className="text-[11px] text-[#21191A]/60 font-sans">Ahmedabad • Verified Buyer</span>
            </div>
          </div>

          <div className="bg-[#FFF9F2] p-8 rounded-3xl border border-[#D6B77A]/30 space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex text-[#D6B77A]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#D6B77A]" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-[#21191A]/80 italic leading-relaxed font-editorial">
                "The Plain Poha Chevdo is feather-light and non-greasy. You can genuinely taste the fresh groundnut oil and the roasted peanuts. Our family teatime staple now."
              </p>
            </div>
            <div className="border-t border-[#D6B77A]/20 pt-4">
              <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-[#50000D]">Anjali Trivedi</h4>
              <span className="text-[11px] text-[#21191A]/60 font-sans">Mumbai • Verified Buyer</span>
            </div>
          </div>

          <div className="bg-[#FFF9F2] p-8 rounded-3xl border border-[#D6B77A]/30 space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex text-[#D6B77A]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#D6B77A]" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-[#21191A]/80 italic leading-relaxed font-editorial">
                "Ordered the 2kg family pack of Chakdi and Methi Chatpati. Arrived in pristine condition with freshness-locked airtight seals. Extraordinary taste and prompt delivery!"
              </p>
            </div>
            <div className="border-t border-[#D6B77A]/20 pt-4">
              <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-[#50000D]">Dhaval Patel</h4>
              <span className="text-[11px] text-[#21191A]/60 font-sans">Vadodara • Verified Buyer</span>
            </div>
          </div>
        </div>
      </section>


      {/* ========================================================
          9. FINAL SHOPPING CTA
          Striking Full-Width Burgundy Section
          "YOUR FAVOURITE GUJARATI FLAVOURS AWAIT."
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#50000D] rounded-3xl p-10 sm:p-16 text-[#FFF0DC] text-center space-y-6 relative overflow-hidden border border-[#D6B77A]/40 shadow-2xl">
          
          {/* Subtle Ambient Glow */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D6B77A_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <span className="inline-flex items-center gap-1.5 bg-[#FFF0DC]/10 text-[#D6B77A] border border-[#D6B77A]/30 px-3.5 py-1 rounded-full text-xs font-heading font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-[#D6B77A]" /> Doorstep Dispatch
            </span>
            
            <h2 className="font-editorial text-3xl sm:text-5xl text-[#FFF0DC] font-bold leading-tight">
              Your Favourite Gujarati <br />
              <span className="italic text-[#D6B77A]">Flavours Await.</span>
            </h2>
            
            <p className="text-xs sm:text-sm text-[#FFF0DC]/80 font-sans max-w-lg mx-auto leading-relaxed">
              Experience the unmatched crunch and heritage taste of homemade Saurashtra snacks. Configurable weights from 250g to 2kg delivered straight to your door.
            </p>

            <div className="pt-4">
              <Link
                to="/snacks"
                className="bg-[#D6B77A] hover:bg-[#E9D8C3] text-[#50000D] font-heading font-bold text-xs uppercase tracking-widest px-10 py-4 rounded-full shadow-xl transition-all inline-flex items-center gap-2 cursor-pointer transform hover:scale-105"
              >
                <span>SHOP NOW</span>
                <ArrowRight className="w-4 h-4 text-[#50000D]" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}

    </div>
  );
};

export default Home;
