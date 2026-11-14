import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/product/ProductCard';
import QuickViewModal from '../components/common/QuickViewModal';
import { useLanguage } from '../context/LanguageContext';
import { useSettings } from '../context/SettingsContext';
import { useCart } from '../context/CartContext';
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
  Plus,
  Check,
  ChevronDown,
  ShoppingBag,
  Zap,
} from 'lucide-react';

const HERO_FEATURED_SNACKS = [
  {
    id: 'gathiya',
    name: 'Tikha Gathiya',
    nameGujarati: 'તીખા ગાંઠિયા',
    tagline: 'Kathiyawadi Signature Besan Strips',
    desc: 'Crisp, airy besan ribbons spiced with freshly cracked black pepper (mari), ajwain, and pure Saurashtra groundnut oil.',
    pricePerKg: 500,
    imageUrl: '/images/snacks/tikha-gathiya.jpg',
    spice: '🌶️🌶️ Spicy',
    badge: 'Bestseller #1',
    slug: 'tikha-gathiya',
  },
  {
    id: 'sev-mamra',
    name: 'Sev Mamra',
    nameGujarati: 'સેવ મમરા',
    tagline: 'Light & Crisp Golden Chai Companion',
    desc: 'Golden puffed rice blended with crispy thin besan sev, seasoned with turmeric, asafoetida, and tempered in pure Sing-Tel.',
    pricePerKg: 360,
    imageUrl: '/images/snacks/sev-mamra.jpg',
    spice: '✨ Mild Crunch',
    badge: 'Chai Favourite',
    slug: 'sev-mamra',
  },
  {
    id: 'chakdi',
    name: 'Kathiyawadi Chakdi',
    nameGujarati: 'કાઠિયાવાડી ચકડી',
    tagline: 'Artisanal Golden Spirals',
    desc: 'Spiral crunch chakli handcrafted with spiced rice flour, roasted sesame seeds (til), and fragrant ajwain.',
    pricePerKg: 500,
    imageUrl: '/images/snacks/chakdi.jpg',
    spice: '🌶️ Medium',
    badge: 'Festive Classic',
    slug: 'chakdi',
  },
  {
    id: 'poha-chevdo',
    name: 'Plain Poha Chevdo',
    nameGujarati: 'પ્લેઇન પૌંઆ ચેવડો',
    tagline: 'Feather-Light Roasted Rice Flakes',
    desc: 'Ultra-thin roasted poha tossed with crunchy groundnuts, green chillies, curry leaves, and a touch of roasted spices.',
    pricePerKg: 400,
    imageUrl: '/images/snacks/plain-poha-chevdo.jpg',
    spice: '✨ Mild & Light',
    badge: 'Zero Cholesterol',
    slug: 'plain-poha-chevdo',
  },
];

const Home = () => {
  const { t, language } = useLanguage();
  const { settings } = useSettings();
  const { addToCart, setIsCartOpen } = useCart();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Hero interactive snack reel state
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroWeight, setHeroWeight] = useState(500);
  const [heroJustAdded, setHeroJustAdded] = useState(false);

  // Mood / Craving filter
  const [activeMood, setActiveMood] = useState('all');

  // Interactive Hamper Box Builder on Home
  const [hamperItems, setHamperItems] = useState([
    { name: 'Tikha Gathiya', grams: 250, price: 125 },
    { name: 'Sev Mamra', grams: 250, price: 90 },
    { name: 'Plain Poha Chevdo', grams: 500, price: 200 },
  ]);
  const [hamperAdded, setHamperAdded] = useState(false);

  // FAQ Accordion
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodData, catData] = await Promise.all([
          api.get('/products?limit=16'),
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

  const currentHeroSnack = HERO_FEATURED_SNACKS[heroIndex];
  const heroDynamicPrice = Math.round((currentHeroSnack.pricePerKg * heroWeight) / 1000);

  const handleHeroAddToCart = () => {
    // Look up real product in products array or create item object
    const realProd = products.find((p) => p.slug === currentHeroSnack.slug) || {
      _id: currentHeroSnack.id,
      name: currentHeroSnack.name,
      slug: currentHeroSnack.slug,
      pricePerKg: currentHeroSnack.pricePerKg,
      images: [{ url: currentHeroSnack.imageUrl }],
    };
    addToCart(realProd, heroWeight, 1);
    setHeroJustAdded(true);
    setTimeout(() => setHeroJustAdded(false), 1600);
    setIsCartOpen(true);
  };

  // Filter products by mood
  const filteredProducts = products.filter((p) => {
    if (activeMood === 'all') return true;
    const nameLower = (p.name || '').toLowerCase();
    const catLower = (p.category?.name || p.categorySlug || '').toLowerCase();

    if (activeMood === 'tea-time') {
      return (
        nameLower.includes('chevdo') ||
        nameLower.includes('puri') ||
        nameLower.includes('nimkin') ||
        catLower.includes('chivda') ||
        catLower.includes('puri')
      );
    }
    if (activeMood === 'spicy') {
      return (
        nameLower.includes('tikha') ||
        nameLower.includes('jhaal') ||
        nameLower.includes('masala') ||
        catLower.includes('gathiya')
      );
    }
    if (activeMood === 'crispy') {
      return (
        nameLower.includes('mamra') ||
        nameLower.includes('chakdi') ||
        nameLower.includes('sev')
      );
    }
    if (activeMood === 'combos') {
      return p.isCombo === true;
    }
    return true;
  });

  const hamperTotalGrams = hamperItems.reduce((acc, it) => acc + it.grams, 0);
  const hamperTotalPrice = hamperItems.reduce((acc, it) => acc + it.price, 0);

  const handleAddHamperToCart = () => {
    const customHamperProduct = {
      _id: 'custom_hamper_box',
      name: `Custom Gujarati Hamper (${hamperTotalGrams}g)`,
      slug: 'custom-combo-builder',
      pricePerKg: Math.round((hamperTotalPrice / hamperTotalGrams) * 1000),
      images: [{ url: '/images/snacks/tea-time-combo.jpg' }],
      isCombo: true,
    };
    addToCart(customHamperProduct, hamperTotalGrams, 1);
    setHamperAdded(true);
    setTimeout(() => setHamperAdded(false), 1600);
    setIsCartOpen(true);
  };

  return (
    <div className="space-y-16 sm:space-y-24 lg:space-y-32 pb-24 overflow-hidden">
      
      {/* ========================================================
          1. NEXT-GEN IMMERSIVE CYBER-HERITAGE HERO SECTION
          Obsidian Burgundy Noir Canvas (#160003 -> #350009 -> #1a0004),
          Glowing Gold Flare, Interactive Snack Showcase Stage
          ======================================================== */}
      <section className="relative bg-gradient-to-b from-[#180004] via-[#350009] to-[#1e0005] text-[#FFF0DC] pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden border-b border-[#D6B77A]/25">
        
        {/* Ambient Radial Golden & Crimson Glow Spheres */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#D6B77A]/12 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-[600px] h-[600px] bg-[#790B13]/30 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D6B77A_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Bold Oversized Futuristic Editorial Typography */}
            <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
              
              {/* Live Status Pill with Glowing Emerald Dot */}
              <div className="inline-flex items-center gap-2.5 bg-[#FFF0DC]/10 backdrop-blur-xl border border-[#D6B77A]/35 px-4 py-1.5 rounded-full text-xs font-heading font-extrabold uppercase tracking-widest text-[#D6B77A] shadow-lg">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>100% Saurashtra Sing-Tel • Direct From Rajkot</span>
              </div>

              {/* Grand Editorial Headline with Shimmering Gold Accent */}
              <div className="space-y-4">
                <h1 className="font-heading font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight text-[#FFF0DC] leading-[1.04]">
                  THE FUTURE OF <br />
                  <span className="text-shimmer-gold font-editorial italic font-normal">
                    Gujarati Taste.
                  </span>
                </h1>
                
                <p className="text-base sm:text-lg text-[#FFF0DC]/85 max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans">
                  Authentic Kathiyawadi farsan elevated with modern small-batch discipline. Prepared strictly in pure filtered groundnut oil with ancestral spice recipes. Zero palm oil, zero chemical preservatives.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-1">
                <Link
                  to="/snacks"
                  className="bg-gradient-to-r from-[#D6B77A] via-[#E9D8C3] to-[#D6B77A] hover:opacity-95 text-[#50000D] font-heading font-extrabold text-xs uppercase tracking-widest px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 flex items-center gap-3 cursor-pointer"
                >
                  <span>EXPLORE COLLECTION</span>
                  <ArrowRight className="w-4 h-4 text-[#50000D]" />
                </Link>

                <Link
                  to="/combo-builder"
                  className="bg-[#3A000A]/80 hover:bg-[#50000D] text-[#FFF0DC] font-heading font-bold text-xs uppercase tracking-widest px-7 py-4 rounded-full border border-[#D6B77A]/40 shadow-lg transition-all flex items-center gap-2 backdrop-blur-md transform hover:-translate-y-1"
                >
                  <Sparkles className="w-4 h-4 text-[#D6B77A]" />
                  <span>BUILD CUSTOM HAMPER</span>
                </Link>
              </div>

              {/* Quality & Trust Counters Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-[#D6B77A]/20">
                <div className="bg-[#FFF0DC]/5 backdrop-blur-md p-3.5 rounded-2xl border border-[#D6B77A]/20 text-center lg:text-left">
                  <span className="block font-heading font-black text-xl sm:text-2xl text-[#D6B77A]">100%</span>
                  <span className="text-[10px] sm:text-[11px] font-heading font-bold uppercase tracking-wider text-[#FFF0DC]/70">Pure Sing-Tel</span>
                </div>
                <div className="bg-[#FFF0DC]/5 backdrop-blur-md p-3.5 rounded-2xl border border-[#D6B77A]/20 text-center lg:text-left">
                  <span className="block font-heading font-black text-xl sm:text-2xl text-[#D6B77A]">4.9 ★</span>
                  <span className="text-[10px] sm:text-[11px] font-heading font-bold uppercase tracking-wider text-[#FFF0DC]/70">8,500+ Orders</span>
                </div>
                <div className="bg-[#FFF0DC]/5 backdrop-blur-md p-3.5 rounded-2xl border border-[#D6B77A]/20 text-center lg:text-left">
                  <span className="block font-heading font-black text-xl sm:text-2xl text-[#D6B77A]">250g - 2kg</span>
                  <span className="text-[10px] sm:text-[11px] font-heading font-bold uppercase tracking-wider text-[#FFF0DC]/70">Flexible Sizes</span>
                </div>
                <div className="bg-[#FFF0DC]/5 backdrop-blur-md p-3.5 rounded-2xl border border-[#D6B77A]/20 text-center lg:text-left">
                  <span className="block font-heading font-black text-xl sm:text-2xl text-[#D6B77A]">Pan-India</span>
                  <span className="text-[10px] sm:text-[11px] font-heading font-bold uppercase tracking-wider text-[#FFF0DC]/70">Fast Dispatch</span>
                </div>
              </div>

            </div>

            {/* Right Column: Interactive Snack Showcase Reel Stage */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative max-w-md w-full">
                
                {/* Decorative Glowing Aura Ring */}
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#D6B77A]/40 to-[#790B13]/60 blur-lg opacity-70 transform -rotate-1 pointer-events-none" />

                {/* Main Glass Showcase Card */}
                <div className="relative bg-[#FFF9F2] p-5 sm:p-7 rounded-3xl shadow-2xl text-[#21191A] border border-[#D6B77A]/40">
                  
                  {/* Floating Pill Badge */}
                  <div className="flex items-center justify-between mb-3.5">
                    <span className="bg-[#50000D] text-[#D6B77A] border border-[#D6B77A]/40 text-[10px] font-heading font-extrabold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                      {currentHeroSnack.badge}
                    </span>
                    <span className="text-[10px] font-heading font-bold text-[#790B13] bg-[#FFF0DC] border border-[#D6B77A]/40 px-2.5 py-0.5 rounded-full">
                      {currentHeroSnack.spice}
                    </span>
                  </div>

                  {/* High-Resolution Food Image */}
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-b from-[#FFF0DC] to-[#FFF9F2] mb-4 border border-[#D6B77A]/30 relative group">
                    <img
                      src={currentHeroSnack.imageUrl}
                      alt={currentHeroSnack.name}
                      className="w-full h-full object-cover transform group-hover:scale-106 transition-transform duration-700"
                    />
                    <div className="absolute bottom-2.5 left-2.5 bg-[#50000D]/90 backdrop-blur-md text-[#FFF0DC] text-[10px] font-heading font-bold px-3 py-1 rounded-lg border border-[#D6B77A]/30 shadow-md">
                      100% Saurashtra Sing-Tel
                    </div>
                  </div>

                  {/* Snack Name & Dynamic Price per kg */}
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-[10px] font-heading font-bold text-[#790B13] uppercase tracking-wider block">
                        {currentHeroSnack.tagline}
                      </span>
                      <h3 className="font-heading font-black text-2xl text-[#50000D] tracking-tight">
                        {language === 'gu' && currentHeroSnack.nameGujarati ? currentHeroSnack.nameGujarati : currentHeroSnack.name}
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className="font-heading font-black text-2xl text-[#790B13] block">₹{heroDynamicPrice}</span>
                      <span className="text-[10px] text-[#21191A]/60 font-medium">for {heroWeight}g</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#21191A]/70 mb-4 leading-relaxed font-sans line-clamp-2">
                    {currentHeroSnack.desc}
                  </p>

                  {/* Interactive Weight Selector Pills Directly on Hero */}
                  <div className="bg-[#FFF0DC]/80 p-2 rounded-2xl border border-[#D6B77A]/30 mb-4">
                    <div className="grid grid-cols-3 gap-1.5">
                      {[250, 500, 1000].map((w) => (
                        <button
                          key={w}
                          type="button"
                          onClick={() => setHeroWeight(w)}
                          className={`py-1.5 text-xs font-heading font-extrabold rounded-xl transition-all cursor-pointer ${
                            heroWeight === w
                              ? 'bg-[#50000D] text-[#FFF0DC] shadow-md border border-[#D6B77A]'
                              : 'text-[#21191A]/80 hover:bg-white/80'
                          }`}
                        >
                          {w >= 1000 ? '1 kg' : `${w}g`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Order / Add to Bag Action Button */}
                  <button
                    type="button"
                    onClick={handleHeroAddToCart}
                    className={`w-full py-3.5 rounded-2xl text-center text-xs font-heading font-extrabold uppercase tracking-widest transition-all shadow-md hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer active:scale-98 ${
                      heroJustAdded
                        ? 'bg-[#174D35] text-white'
                        : 'bg-gradient-to-r from-[#50000D] via-[#790B13] to-[#50000D] text-[#FFF0DC] border border-[#D6B77A]/40'
                    }`}
                  >
                    {heroJustAdded ? (
                      <>
                        <Check className="w-4 h-4 text-white" />
                        <span>ADDED TO YOUR BAG!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4 text-[#D6B77A]" />
                        <span>ORDER {currentHeroSnack.name.toUpperCase()} (₹{heroDynamicPrice})</span>
                      </>
                    )}
                  </button>

                  {/* Quick Thumbnail Switcher Strip */}
                  <div className="pt-4 mt-4 border-t border-[#D6B77A]/25">
                    <div className="flex items-center justify-between text-[10px] font-heading font-bold uppercase tracking-wider text-[#21191A]/60 mb-2">
                      <span>Quick Switch Snack:</span>
                      <span className="text-[#790B13]">{heroIndex + 1} of 4</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {HERO_FEATURED_SNACKS.map((snack, idx) => (
                        <button
                          key={snack.id}
                          type="button"
                          onClick={() => {
                            setHeroIndex(idx);
                          }}
                          className={`aspect-square rounded-xl overflow-hidden border-2 transition-all p-0.5 cursor-pointer ${
                            heroIndex === idx
                              ? 'border-[#790B13] shadow-md scale-105'
                              : 'border-transparent opacity-60 hover:opacity-100'
                          }`}
                          title={snack.name}
                        >
                          <img
                            src={snack.imageUrl}
                            alt={snack.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ========================================================
          2. INTERACTIVE CRAVING COMPASS (MOOD SELECTOR)
          Modern Floating Pill Filter with Icons
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
          <span className="font-heading text-xs font-bold uppercase tracking-widest text-[#790B13]">
            What Are You Craving Today?
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl text-[#50000D] font-bold">
            The Craving Navigator
          </h2>
          <p className="text-xs sm:text-sm text-[#21191A]/70">
            Pick a mood to instantly curate your snacks.
          </p>
        </div>

        {/* Futuristic Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
          {[
            { id: 'all', label: 'All Varieties', icon: '✨' },
            { id: 'tea-time', label: 'Chai-Time Crunch', icon: '🍵' },
            { id: 'spicy', label: 'Spicy Kathiyawadi', icon: '🔥' },
            { id: 'crispy', label: 'Light & Crisp', icon: '🌾' },
            { id: 'combos', label: 'Special Hampers', icon: '🎁' },
          ].map((mood) => {
            const isActive = activeMood === mood.id;
            return (
              <button
                key={mood.id}
                type="button"
                onClick={() => setActiveMood(mood.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-heading font-extrabold uppercase tracking-wider transition-all cursor-pointer shadow-xs ${
                  isActive
                    ? 'bg-[#50000D] text-[#FFF0DC] border border-[#D6B77A] shadow-md scale-105'
                    : 'bg-[#FFF0DC]/70 hover:bg-[#FFF0DC] text-[#21191A]/80 border border-[#D6B77A]/30'
                }`}
              >
                <span>{mood.icon}</span>
                <span>{mood.label}</span>
              </button>
            );
          })}
        </div>
      </section>


      {/* ========================================================
          3. SIGNATURE SNACKS SHOWCASE (DYNAMIC GRID)
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4 pb-4 border-b border-[#D6B77A]/25">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-heading font-bold uppercase tracking-widest text-[#790B13] mb-1">
              <Flame className="w-3.5 h-3.5 text-[#790B13]" /> Pure Sing-Tel Farsan
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl text-[#50000D] font-bold">
              Signature Snack Collection
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

        {/* Responsive Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {filteredProducts.slice(0, 8).map((product) => (
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
            className="inline-flex items-center gap-2 bg-[#50000D] hover:bg-[#790B13] text-[#FFF0DC] border border-[#D6B77A]/40 font-heading font-extrabold text-xs uppercase tracking-widest px-8 py-4 rounded-full shadow-lg transition-all transform hover:-translate-y-0.5"
          >
            <span>EXPLORE FULL 11-SNACK CATALOGUE</span>
            <ArrowRight className="w-4 h-4 text-[#D6B77A]" />
          </Link>
        </div>
      </section>


      {/* ========================================================
          4. INTERACTIVE CUSTOM SNACK BOX STUDIO (ON-PAGE LAB)
          Direct visual hamper packing preview
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#50000D] via-[#790B13] to-[#3A000A] rounded-3xl p-6 sm:p-12 text-[#FFF0DC] relative overflow-hidden shadow-2xl border border-[#D6B77A]/40">
          
          {/* Subtle Ambient Pattern */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10 bg-[radial-gradient(#D6B77A_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left Info */}
            <div className="lg:col-span-6 space-y-5">
              <span className="inline-flex items-center gap-1.5 bg-[#FFF0DC]/10 text-[#D6B77A] border border-[#D6B77A]/30 px-3.5 py-1 rounded-full text-xs font-heading font-bold uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5 text-[#D6B77A]" /> Custom Dabba Box Studio
              </span>
              
              <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#FFF0DC] leading-tight">
                Curate Your 1kg <br />
                <span className="text-shimmer-gold font-editorial italic font-normal">
                  Artisanal Hamper.
                </span>
              </h2>
              
              <p className="text-xs sm:text-sm text-[#FFF0DC]/85 leading-relaxed font-sans">
                Never settle for just one snack. Mix and match 250g, 500g, or 1kg pouches of your family favourites into a personalized gift box. Transparent weights and instant dynamic calculations.
              </p>

              {/* Weight Progress Capacity Meter */}
              <div className="bg-[#3A000A]/80 backdrop-blur-md p-4 rounded-2xl border border-[#D6B77A]/30 space-y-2 max-w-md">
                <div className="flex items-center justify-between text-xs font-heading font-bold">
                  <span className="text-[#FFF0DC]">Hamper Capacity:</span>
                  <span className="text-[#D6B77A] font-black">{hamperTotalGrams}g / 1000g</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#D6B77A] to-amber-300 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (hamperTotalGrams / 1000) * 100)}%` }}
                  />
                </div>
                <p className="text-[10px] text-[#FFF0DC]/70 font-sans">
                  {hamperTotalGrams >= 1000
                    ? '🎉 Perfect 1kg family hamper reached!'
                    : `Add ${1000 - hamperTotalGrams}g more for an optimal 1kg combo box.`}
                </p>
              </div>

              {/* CTA Launch Full Builder */}
              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleAddHamperToCart}
                  className={`px-8 py-3.5 rounded-full text-xs font-heading font-extrabold uppercase tracking-widest transition-all shadow-lg flex items-center gap-2 cursor-pointer ${
                    hamperAdded
                      ? 'bg-[#174D35] text-white'
                      : 'bg-[#D6B77A] hover:bg-[#E9D8C3] text-[#50000D]'
                  }`}
                >
                  {hamperAdded ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>HAMPER ADDED TO BAG!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-[#50000D]" />
                      <span>PACK & ADD HAMPER (₹{hamperTotalPrice})</span>
                    </>
                  )}
                </button>

                <Link
                  to="/combo-builder"
                  className="px-6 py-3.5 rounded-full text-xs font-heading font-bold uppercase tracking-widest text-[#FFF0DC] border border-[#D6B77A]/40 hover:bg-[#50000D] transition-all flex items-center gap-1.5"
                >
                  <span>ADVANCED BUILDER</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#D6B77A]" />
                </Link>
              </div>
            </div>

            {/* Right Visual Hamper Box Preview */}
            <div className="lg:col-span-6 space-y-3">
              <div className="bg-[#FFF9F2] text-[#21191A] p-5 sm:p-6 rounded-3xl border border-[#D6B77A]/40 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-[#D6B77A]/25 pb-3">
                  <div>
                    <h3 className="font-heading font-extrabold text-base text-[#50000D]">
                      Bespoke Box Contents
                    </h3>
                    <p className="text-[10px] text-[#21191A]/60 font-sans">
                      Sealed individually for maximum crunch retention
                    </p>
                  </div>
                  <span className="font-heading font-black text-xl text-[#790B13]">
                    ₹{hamperTotalPrice}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {hamperItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-xl bg-[#FFF0DC]/50 border border-[#D6B77A]/30 text-xs font-heading"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-lg bg-[#50000D] text-[#D6B77A] font-bold text-[10px] flex items-center justify-center">
                          0{idx + 1}
                        </span>
                        <div>
                          <p className="font-extrabold text-[#21191A]">{item.name}</p>
                          <span className="text-[10px] text-[#790B13] font-bold">100% Sing-Tel</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-[#50000D]">{item.grams}g</span>
                        <span className="text-[10px] text-[#21191A]/60 block">₹{item.price}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 text-[11px] text-[#21191A]/70 flex items-center gap-2 bg-[#FFF0DC] p-3 rounded-xl border border-[#D6B77A]/30">
                  <ShieldCheck className="w-4 h-4 text-[#790B13] shrink-0" />
                  <span>Doorstep dispatched in shock-absorbing gift carton across India.</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ========================================================
          5. NEXT-GEN BENTO GRID: THE ARCHITECTURE OF PURITY
          Apple/Linear Luxury Design Language
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <span className="font-heading text-xs font-bold uppercase tracking-widest text-[#790B13]">
            Uncompromising Standards
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl text-[#50000D] font-bold">
            The Architecture of Authentic Nasta
          </h2>
          <p className="text-xs sm:text-sm text-[#21191A]/70">
            Why our homemade Gujarati namkeen hits completely different.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Bento Card 1 (Large 2-column Spanning Dark Obsidian Card) */}
          <div className="md:col-span-2 bg-gradient-to-br from-[#2D0007] to-[#50000D] text-[#FFF0DC] p-8 sm:p-10 rounded-3xl border border-[#D6B77A]/35 shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#D6B77A]/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="space-y-4 max-w-lg relative z-10">
              <span className="inline-flex items-center gap-1.5 bg-[#FFF0DC]/10 text-[#D6B77A] border border-[#D6B77A]/30 px-3 py-1 rounded-full text-[10px] font-heading font-extrabold uppercase tracking-widest">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D6B77A]" /> The Golden Rule
              </span>
              <h3 className="font-heading font-black text-2xl sm:text-3xl text-[#FFF0DC] tracking-tight">
                100% Saurashtra Sing-Tel. <br />
                <span className="font-editorial italic font-normal text-[#D6B77A]">Zero Palm Oil. Zero Blends.</span>
              </h3>
              <p className="text-xs sm:text-sm text-[#FFF0DC]/85 font-sans leading-relaxed">
                Commercial snacks use cheap refined palm oil that coats your palate and causes heaviness. We exclusively use pure filtered groundnut oil from Saurashtra. Sing-Tel has a clean smoking point, giving our farsan its signature nutty fragrance, light crunch, and easy digestibility.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-6 mt-6 border-t border-[#D6B77A]/20 relative z-10 text-center">
              <div className="bg-[#FFF0DC]/5 p-3 rounded-2xl border border-[#D6B77A]/20">
                <span className="font-heading font-black text-lg sm:text-xl text-[#D6B77A] block">0%</span>
                <span className="text-[10px] text-[#FFF0DC]/70 uppercase font-heading font-bold">Palm Oil</span>
              </div>
              <div className="bg-[#FFF0DC]/5 p-3 rounded-2xl border border-[#D6B77A]/20">
                <span className="font-heading font-black text-lg sm:text-xl text-[#D6B77A] block">100%</span>
                <span className="text-[10px] text-[#FFF0DC]/70 uppercase font-heading font-bold">Sing-Tel</span>
              </div>
              <div className="bg-[#FFF0DC]/5 p-3 rounded-2xl border border-[#D6B77A]/20">
                <span className="font-heading font-black text-lg sm:text-xl text-[#D6B77A] block">Zero</span>
                <span className="text-[10px] text-[#FFF0DC]/70 uppercase font-heading font-bold">Preservatives</span>
              </div>
            </div>
          </div>

          {/* Bento Card 2: Rajkot Born & Bred */}
          <div className="bg-[#FFF9F2] p-8 rounded-3xl border border-[#D6B77A]/35 shadow-md flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#50000D] text-[#D6B77A] flex items-center justify-center font-heading font-bold text-lg shadow-sm">
                <Flame className="w-6 h-6 text-[#D6B77A]" />
              </div>
              <span className="text-[10px] font-heading font-bold text-[#790B13] uppercase tracking-wider block">
                Rajkot Kitchen Direct
              </span>
              <h3 className="font-heading font-black text-xl text-[#50000D]">
                Ancestral Kathiyawadi Spice Craft
              </h3>
              <p className="text-xs text-[#21191A]/70 leading-relaxed font-sans">
                Stone-ground hing (asafoetida), freshly cracked black pepper (mari), and hand-picked ajwain. Flavours balanced across three generations of Rajkot farsan heritage.
              </p>
            </div>
            <div className="bg-[#FFF0DC] p-3 rounded-xl border border-[#D6B77A]/30 text-center">
              <span className="font-heading text-xs font-bold text-[#50000D] uppercase tracking-wider">
                Rajkot, Gujarat
              </span>
            </div>
          </div>

          {/* Bento Card 3: Configurable 250g to 2kg */}
          <div className="bg-[#FFF9F2] p-8 rounded-3xl border border-[#D6B77A]/35 shadow-md flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#790B13] text-[#FFF0DC] flex items-center justify-center shadow-sm">
                <Package className="w-6 h-6 text-[#D6B77A]" />
              </div>
              <span className="text-[10px] font-heading font-bold text-[#790B13] uppercase tracking-wider block">
                Transparent Weights
              </span>
              <h3 className="font-heading font-black text-xl text-[#50000D]">
                Configurable 250g to 2kg Packs
              </h3>
              <p className="text-xs text-[#21191A]/70 leading-relaxed font-sans">
                Order exactly what your pantry needs. Choose single 250g trial pouches, 500g tea-time packs, or 1kg and 2kg family festive bulk sizes with dynamic, honest per-kg pricing.
              </p>
            </div>
            <div className="bg-[#FFF0DC] p-3 rounded-xl border border-[#D6B77A]/30 text-center">
              <span className="font-heading text-xs font-bold text-[#790B13] uppercase tracking-wider">
                250g • 500g • 1kg • 2kg
              </span>
            </div>
          </div>

          {/* Bento Card 4 (Spanning 2 Columns on bottom): Airtight Freshness & Safe Shipping */}
          <div className="md:col-span-2 bg-gradient-to-r from-[#FFF0DC] to-[#FFF9F2] p-8 sm:p-10 rounded-3xl border border-[#D6B77A]/35 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-3 max-w-md">
              <span className="inline-flex items-center gap-1.5 bg-[#50000D] text-[#D6B77A] px-3 py-0.5 rounded-full text-[10px] font-heading font-bold uppercase tracking-widest">
                <Truck className="w-3.5 h-3.5 text-[#D6B77A]" /> Pan-India Doorstep Dispatch
              </span>
              <h3 className="font-heading font-black text-2xl text-[#50000D]">
                Airtight Moisture-Proof Pouches
              </h3>
              <p className="text-xs sm:text-sm text-[#21191A]/75 font-sans leading-relaxed">
                Every snack is packed in food-grade resealable pouches that seal out humidity and lock in the crisp Kathiyawadi snap for up to 90 days. Shipped in protective cartons straight to your door.
              </p>
            </div>
            <div className="shrink-0 text-center bg-white p-5 rounded-2xl border border-[#D6B77A]/30 shadow-xs">
              <span className="font-heading font-black text-3xl text-[#790B13] block">90 Days</span>
              <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-[#21191A]/70">Pristine Crispness</span>
            </div>
          </div>

        </div>
      </section>


      {/* ========================================================
          6. VERIFIED PATRON LOVE (TESTIMONIALS WALL)
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <span className="font-heading text-xs font-bold uppercase tracking-widest text-[#790B13]">
            Verified Customer Stories
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl text-[#50000D] font-bold">
            Loved by 8,500+ Farsan Lovers
          </h2>
          <p className="text-xs sm:text-sm text-[#21191A]/70">
            Real feedback from households enjoying authentic Rajkot taste.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#FFF9F2] p-8 rounded-3xl border border-[#D6B77A]/35 space-y-4 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex text-[#D6B77A] gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#D6B77A]" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-[#21191A]/80 italic leading-relaxed font-editorial">
                "Finding authentic Kathiyawadi Tikha Gathiya made in pure Sing-Tel outside Rajkot was impossible until I ordered from here. The pepper punch and soft melt-in-mouth texture are unbelievable."
              </p>
            </div>
            <div className="border-t border-[#D6B77A]/20 pt-4 flex items-center justify-between">
              <div>
                <h4 className="font-heading font-extrabold text-xs uppercase tracking-wider text-[#50000D]">Bhavik Mehta</h4>
                <span className="text-[11px] text-[#21191A]/60 font-sans">Ahmedabad</span>
              </div>
              <span className="text-[10px] font-heading font-bold bg-[#174D35]/10 text-[#174D35] px-2 py-0.5 rounded-full">
                Verified Buyer
              </span>
            </div>
          </div>

          <div className="bg-[#FFF9F2] p-8 rounded-3xl border border-[#D6B77A]/35 space-y-4 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex text-[#D6B77A] gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#D6B77A]" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-[#21191A]/80 italic leading-relaxed font-editorial">
                "The Plain Poha Chevdo is feather-light and not oily at all. You can genuinely taste the fresh groundnut oil and the crispy roasted peanuts. It has become our daily teatime companion."
              </p>
            </div>
            <div className="border-t border-[#D6B77A]/20 pt-4 flex items-center justify-between">
              <div>
                <h4 className="font-heading font-extrabold text-xs uppercase tracking-wider text-[#50000D]">Anjali Trivedi</h4>
                <span className="text-[11px] text-[#21191A]/60 font-sans">Mumbai</span>
              </div>
              <span className="text-[10px] font-heading font-bold bg-[#174D35]/10 text-[#174D35] px-2 py-0.5 rounded-full">
                Verified Buyer
              </span>
            </div>
          </div>

          <div className="bg-[#FFF9F2] p-8 rounded-3xl border border-[#D6B77A]/35 space-y-4 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex text-[#D6B77A] gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#D6B77A]" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-[#21191A]/80 italic leading-relaxed font-editorial">
                "Ordered the 2kg family combo of Chakdi and Methi Chatpati for Diwali. Reached in pristine airtight packing without a single broken piece. Outstanding taste and super quick delivery!"
              </p>
            </div>
            <div className="border-t border-[#D6B77A]/20 pt-4 flex items-center justify-between">
              <div>
                <h4 className="font-heading font-extrabold text-xs uppercase tracking-wider text-[#50000D]">Dhaval Patel</h4>
                <span className="text-[11px] text-[#21191A]/60 font-sans">Vadodara</span>
              </div>
              <span className="text-[10px] font-heading font-bold bg-[#174D35]/10 text-[#174D35] px-2 py-0.5 rounded-full">
                Verified Buyer
              </span>
            </div>
          </div>
        </div>
      </section>


      {/* ========================================================
          7. FREQUENTLY ASKED QUESTIONS (ACCORDION)
          ======================================================== */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 space-y-2">
          <span className="font-heading text-xs font-bold uppercase tracking-widest text-[#790B13]">
            Common Queries
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl text-[#50000D] font-bold">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'What oil do you use for frying your snacks?',
              a: 'We use 100% pure filtered groundnut oil (Sing-Tel) sourced locally from Saurashtra. We never use palm oil, cottonseed oil, or blended oils in any of our farsan.',
            },
            {
              q: 'What is the shelf life of the snacks and how are they packed?',
              a: 'Our snacks have a shelf life of 90 days. Every order is packed in food-grade, moisture-proof zip-lock pouches to lock in crunch, freshness, and authentic aroma.',
            },
            {
              q: 'Can I order different weights like 250g, 500g, or 1kg?',
              a: 'Yes! All our products have flexible pack sizes ranging from 250g to 2kg. You can choose the exact weight you want on the product card or build a custom hamper in our Custom Box Studio.',
            },
            {
              q: 'How fast is delivery across India?',
              a: 'Orders are dispatched within 24 hours from Rajkot, Gujarat. Delivery takes 1-2 days within Gujarat and 3-5 days for other major Indian metros.',
            },
          ].map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-[#FFF9F2] rounded-2xl border border-[#D6B77A]/35 overflow-hidden transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-heading font-extrabold text-sm sm:text-base text-[#50000D] cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#790B13] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 sm:pb-5 text-xs sm:text-sm text-[#21191A]/75 font-sans leading-relaxed border-t border-[#D6B77A]/20 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>


      {/* ========================================================
          8. VIP WELCOME OFFER BANNER (NASTA50)
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#50000D] via-[#790B13] to-[#3A000A] rounded-3xl p-8 sm:p-14 text-[#FFF0DC] text-center space-y-5 relative overflow-hidden border border-[#D6B77A]/40 shadow-2xl">
          <div className="max-w-xl mx-auto space-y-3 relative z-10">
            <span className="inline-flex items-center gap-1.5 bg-[#FFF0DC]/10 text-[#D6B77A] border border-[#D6B77A]/30 px-3.5 py-1 rounded-full text-xs font-heading font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-[#D6B77A]" /> Welcome Patron Discount
            </span>
            <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#FFF0DC] leading-tight">
              Enjoy ₹50 Off <br />
              <span className="text-shimmer-gold font-editorial italic font-normal">Your First Order.</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#FFF0DC]/80 font-sans leading-relaxed">
              Use promo code <strong className="text-[#D6B77A] font-extrabold tracking-wider bg-black/30 px-2 py-0.5 rounded-md">NASTA50</strong> at checkout on orders above ₹499.
            </p>
            <div className="pt-3">
              <Link
                to="/snacks"
                className="bg-[#D6B77A] hover:bg-[#E9D8C3] text-[#50000D] font-heading font-extrabold text-xs uppercase tracking-widest px-10 py-4 rounded-full shadow-xl transition-all inline-flex items-center gap-2 cursor-pointer transform hover:scale-105"
              >
                <span>CLAIM DISCOUNT & SHOP NOW</span>
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
