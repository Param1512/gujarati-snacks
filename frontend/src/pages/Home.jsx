import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/product/ProductCard';
import QuickViewModal from '../components/common/QuickViewModal';
import { useLanguage } from '../context/LanguageContext';
import { useSettings } from '../context/SettingsContext';
import { useCart } from '../context/CartContext';
import confetti from 'canvas-confetti';
import {
  ArrowRight,
  Leaf,
  Zap,
  Heart,
  Smile,
  Briefcase,
  GraduationCap,
  Plane,
  Home as HomeIcon,
  Truck,
  ShieldCheck,
  Star,
  Sparkles,
  CheckCircle2,
  Package,
  Plus,
  Flame,
  Check,
  Coffee,
  Volume2,
  Sliders,
  Award,
  Clock,
  Activity,
  Layers,
  ChevronRight,
} from 'lucide-react';

const Home = () => {
  const { t, language } = useLanguage();
  const { settings } = useSettings();
  const { addToCart, setIsCartOpen } = useCart();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // ==========================================================
  // 1. FLAVOR SPECTRUM DATA (Vibrant 3D Showcase)
  // ==========================================================
  const flavorSpectrum = [
    {
      id: 'gathiya',
      name: 'Tikha Gathiya',
      nameGujarati: 'તીખા ગાંઠિયા',
      badge: '★ RAJKOT SIGNATURE',
      tagline: 'The Legendary Kathiyawadi Fire & Crisp',
      pricePerKg: 500,
      image: '/images/snacks/tikha-gathiya.jpg',
      themeColor: '#FF3815',
      glowColor: 'rgba(255, 56, 21, 0.28)',
      gradientCard: 'from-[#FF3815]/15 via-[#FF8A00]/10 to-[#FFFDF9]',
      accentBg: 'bg-[#FF3815]',
      accentText: 'text-[#FF3815]',
      borderStyle: 'border-[#FF3815]',
      crunchDecibels: '105 dB',
      crunchDescriptor: 'Explosive Shatter',
      crunchPercent: 95,
      spiceScore: '🌶️🌶️🌶️ Authentic Kathiyawadi Heat',
      oilPurity: '100% Saurashtra Sing-Tel',
      bestWith: '☕ Cutting Masala Chai & Fried Chillies',
      description: 'Melt-in-mouth golden strips fried in pure groundnut oil, infused with stone-ground Bhavnagari hing, cracked black pepper, and whole ajwain.',
    },
    {
      id: 'chevdo',
      name: 'Plain Poha Chevdo',
      nameGujarati: 'પૌંઆ ચેવડો',
      badge: '🍃 ALL-DAY ROAST',
      tagline: 'Paper-Thin Golden Flakes & Roasted Peanuts',
      pricePerKg: 400,
      image: '/images/snacks/plain-poha-chevdo.jpg',
      themeColor: '#00C076',
      glowColor: 'rgba(0, 192, 118, 0.25)',
      gradientCard: 'from-[#00C076]/15 via-[#10B981]/10 to-[#FFFDF9]',
      accentBg: 'bg-[#00C076]',
      accentText: 'text-[#00C076]',
      borderStyle: 'border-[#00C076]',
      crunchDecibels: '82 dB',
      crunchDescriptor: 'Feather-Light Crunch',
      crunchPercent: 78,
      spiceScore: '🌶️ Sweet, Savory & Tangy Harmony',
      oilPurity: '100% Saurashtra Sing-Tel',
      bestWith: '☀️ 4 PM Office Hunger & Lemonade',
      description: 'Delicately fried beaten rice flakes with golden peanuts, crispy roasted dal, dried curry leaves, turmeric, and mild green chillies.',
    },
    {
      id: 'chakdi',
      name: 'Chakdi & Sing',
      nameGujarati: 'ચકરી અને સીંગ',
      badge: '🌀 CONCENTRIC CRUNCH',
      tagline: 'Hand-Coiled Sesame & Spiced Spirals',
      pricePerKg: 500,
      image: '/images/snacks/chakdi.jpg',
      themeColor: '#F59E0B',
      glowColor: 'rgba(245, 158, 11, 0.3)',
      gradientCard: 'from-[#F59E0B]/18 via-[#FF5722]/10 to-[#FFFDF9]',
      accentBg: 'bg-[#F59E0B]',
      accentText: 'text-[#F59E0B]',
      borderStyle: 'border-[#F59E0B]',
      crunchDecibels: '112 dB',
      crunchDescriptor: 'Deep Resonant Snap',
      crunchPercent: 100,
      spiceScore: '🌶️🌶️ Roasted White Sesame Warmth',
      oilPurity: '100% Saurashtra Sing-Tel',
      bestWith: '🌧️ Monsoon Evenings & Ginger Tea',
      description: 'Crisp spiral concentric rings forged from premium rice and gram flour, seasoned with toasted sesame seeds and Himalayan rock salt.',
    },
    {
      id: 'sev-mamra',
      name: 'Sev Mamra',
      nameGujarati: 'સેવ મમરા',
      badge: '✨ LIGHTWEIGHT BLISS',
      tagline: 'Sing-Tel Turmeric Puffed Crisps',
      pricePerKg: 350,
      image: '/images/snacks/sev-mamra.jpg',
      themeColor: '#7C3AED',
      glowColor: 'rgba(124, 58, 237, 0.25)',
      gradientCard: 'from-[#7C3AED]/15 via-[#FF4D2D]/10 to-[#FFFDF9]',
      accentBg: 'bg-[#7C3AED]',
      accentText: 'text-[#7C3AED]',
      borderStyle: 'border-[#7C3AED]',
      crunchDecibels: '74 dB',
      crunchDescriptor: 'Airy Turmeric Pop',
      crunchPercent: 70,
      spiceScore: '🌶️ Gentle Saurashtra Mild Spice',
      oilPurity: '100% Saurashtra Sing-Tel',
      bestWith: '🍋 Squeezed Lime & Diced Onions',
      description: 'Kolhapur puffed rice toasted in aromatic Sing-Tel with haldi and mustard seeds, combined with crunchy Kathiyawadi besan sev.',
    },
  ];

  const [activeFlavor, setActiveFlavor] = useState(flavorSpectrum[0]);
  const [heroWeight, setHeroWeight] = useState(500);
  const [heroAddedNotice, setHeroAddedNotice] = useState(false);

  // 3D Mouse Parallax Tilt state
  const [cardTilt, setCardTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  const handleCardMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setCardTilt({ x: -(y * 18), y: x * 18 });
  };

  const handleCardMouseLeave = () => {
    setCardTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  // 3D Dabba Customizer state on the homepage
  const [dabbaItems, setDabbaItems] = useState([
    { id: 'gathiya', name: 'Tikha Gathiya', weight: 250, price: 125, added: true },
    { id: 'chevdo', name: 'Poha Chevdo', weight: 250, price: 100, added: true },
    { id: 'chakdi', name: 'Chakdi & Sing', weight: 250, price: 125, added: false },
    { id: 'sev-mamra', name: 'Sev Mamra', weight: 250, price: 88, added: false },
  ]);

  const toggleDabbaItem = (id) => {
    setDabbaItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, added: !item.added } : item))
    );
  };

  const dabbaActiveItems = dabbaItems.filter((i) => i.added);
  const dabbaTotalGrams = dabbaActiveItems.reduce((acc, i) => acc + i.weight, 0);
  const dabbaTotalPrice = dabbaActiveItems.reduce((acc, i) => acc + i.price, 0);

  const handleAddDabbaToCart = () => {
    dabbaActiveItems.forEach((item) => {
      const match = products.find((p) => p.name?.toLowerCase().includes(item.name.toLowerCase())) || {
        _id: `custom-dabba-${item.id}`,
        name: item.name,
        pricePerKg: Math.round((item.price / item.weight) * 1000),
        images: [{ url: `/images/snacks/${item.id}.jpg` }],
        isCombo: true,
      };
      addToCart(match, item.weight, 1);
    });

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.65 },
      colors: ['#FF3815', '#FFB800', '#00C076', '#7C3AED'],
    });

    setIsCartOpen(true);
  };

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

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter((p) => p.category?._id === selectedCategory || p.category?.slug === selectedCategory);

  const currentHeroPrice = Math.round((activeFlavor.pricePerKg * heroWeight) / 1000);

  const handleQuickAddHero = () => {
    const matchingProd = products.find((p) =>
      p.name?.toLowerCase().includes(activeFlavor.name.toLowerCase())
    ) || {
      _id: `hero-${activeFlavor.id}`,
      name: activeFlavor.name,
      pricePerKg: activeFlavor.pricePerKg,
      images: [{ url: activeFlavor.image }],
    };
    addToCart(matchingProd, heroWeight, 1);
    setHeroAddedNotice(true);

    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
      colors: [activeFlavor.themeColor, '#FFD043', '#FFFFFF'],
    });

    setTimeout(() => setHeroAddedNotice(false), 2000);
    setIsCartOpen(true);
  };

  return (
    <div className="font-sans bg-[#FFFDF9] text-[#111827] overflow-hidden selection:bg-[#FF3815] selection:text-white">
      
      {/* ========================================================
          0. HIGH-OCTANE 3D LIVE KITCHEN MARQUEE TICKER
         ======================================================== */}
      <div className="bg-[#111827] text-white py-2.5 px-4 border-b border-white/10 font-heading text-xs font-black uppercase tracking-wider relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-2.5 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00C076] animate-ping" />
            <span className="text-[#00C076] font-black">● LIVE KITCHEN TELEMETRY</span>
          </div>

          <div className="hidden sm:flex items-center gap-6 overflow-hidden text-[11px] text-white/90">
            <span className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-[#FF3815]" /> Today's Morning Batch #342
            </span>
            <span className="text-white/30">•</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#FFB800]" /> 100% Sing-Tel (0.0% Palm Oil)
            </span>
            <span className="text-white/30">•</span>
            <span className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-[#00C076]" /> Free Express Shipping Over ₹499
            </span>
            <span className="text-white/30">•</span>
            <span className="flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-[#7C3AED]" /> Dispatched Same-Day from Rajkot
            </span>
          </div>

          <div className="text-[11px] font-bold text-[#FFB800] shrink-0">
            1,480+ Orders Sent This Week 🚀
          </div>
        </div>
      </div>

      {/* ========================================================
          1. JAW-DROPPING 3D INTERACTIVE HERO SECTION
         ======================================================== */}
      <section className="relative pt-8 pb-16 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-radial from-[#FFF5EC] via-[#FFFDF9] to-[#FFF9F0]">
        
        {/* Dynamic 3D Floating Particle Spheres in Background */}
        <div
          className="absolute -top-10 -right-10 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none transition-all duration-700 animate-pulse-glow"
          style={{ backgroundColor: activeFlavor.glowColor }}
        />
        <div className="absolute top-1/2 -left-20 w-80 h-80 bg-[#FFB800]/15 rounded-full blur-3xl pointer-events-none animate-float-slow" />
        <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-[#00C076]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
            
            {/* Left Column: Kinetic Typography, Live Badges & 3D CTAs */}
            <div className="lg:col-span-6 space-y-6 sm:space-y-8 text-center lg:text-left">
              
              {/* Slanted 3D Pill Badge */}
              <div className="inline-flex items-center gap-2.5 bg-white border-2 border-[#111827] px-4 py-2 rounded-2xl shadow-[0_4px_0_#111827] transform -rotate-1 hover:rotate-0 transition-transform">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF3815] animate-pulse" />
                <span className="text-xs font-heading font-black uppercase tracking-wider text-[#111827]">
                  Rajkot Direct • Pure Cold-Filtered Sing-Tel
                </span>
                <span className="text-sm">✦</span>
              </div>

              {/* Kinetic 3D Headline with Dynamic Flavor Glow */}
              <h1 className="font-heading font-black text-4xl sm:text-6xl lg:text-7xl leading-[1.04] tracking-tight text-[#111827]">
                Authentic Gujarati snacks,<br />
                <span
                  className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF3815] via-[#FF8A00] to-[#FFB800] transition-colors duration-500 drop-shadow-xs"
                >
                  supercharged
                </span>{' '}
                with crunch.
              </h1>

              {/* Punchy Editorial Subtitle */}
              <p className="text-sm sm:text-base text-[#4B5563] max-w-xl mx-auto lg:mx-0 font-sans leading-relaxed font-medium">
                Giriraj fries authentic Kathiyawadi farsan fresh before sunrise every morning in 100% pure filtered groundnut oil (Sing-Tel) with stone-ground spices. Zero palm oil, zero chemical preservatives, uncompromised crunch.
              </p>

              {/* 3D Tactile Action Buttons with Physical Depth */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/snacks"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#FF3815] hover:bg-[#D92B0C] text-white font-heading font-black text-base px-8 py-4 rounded-2xl shadow-[0_8px_0_#A31A03] active:translate-y-2 active:shadow-[0_1px_0_#A31A03] transform hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  <Flame className="w-5 h-5 text-[#FFD043] animate-bounce" />
                  <span>Taste The Collection</span>
                  <ArrowRight className="w-5 h-5 text-white" />
                </Link>

                <Link
                  to="/combo-builder"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white hover:bg-[#FFF5EC] text-[#111827] border-2 border-[#111827] font-heading font-black text-sm px-7 py-4 rounded-2xl shadow-[0_6px_0_#111827] active:translate-y-1.5 active:shadow-none transition-all cursor-pointer"
                >
                  <Package className="w-5 h-5 text-[#FF3815]" />
                  <span>Custom Snack Dabba</span>
                </Link>
              </div>

              {/* Social Proof & Purity Seals */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 text-xs font-heading font-black text-[#111827]">
                <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-2xl border-2 border-[#111827] shadow-[0_3px_0_#111827]">
                  <div className="flex text-[#FFB800]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#FFB800]" />
                    ))}
                  </div>
                  <span>4.9 / 5.0 (14,200+ Verified Snackers)</span>
                </div>

                <div className="flex items-center gap-1.5 bg-[#E8FDF5] text-[#00C076] px-3.5 py-2 rounded-2xl border-2 border-[#00C076] shadow-[0_3px_0_#00C076] font-extrabold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Zero Palm Oil</span>
                </div>
              </div>

            </div>

            {/* Right Column: 3D INTERACTIVE CURSOR-TILT STAGE */}
            <div className="lg:col-span-6 relative mt-4 lg:mt-0 perspective-1000">
              
              {/* Slanted Floating Sticker Header */}
              <div className="flex items-center justify-between pb-3 overflow-x-auto scrollbar-none gap-2">
                <span className="text-[11px] font-heading font-black uppercase text-[#4B5563] tracking-wider shrink-0">
                  Switch Flavor:
                </span>
                
                <div className="flex gap-1.5">
                  {flavorSpectrum.map((flavor) => {
                    const isSelected = activeFlavor.id === flavor.id;
                    return (
                      <button
                        key={flavor.id}
                        onClick={() => setActiveFlavor(flavor)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-heading font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                          isSelected
                            ? `${flavor.accentBg} text-white shadow-md scale-105 border-2 border-[#111827]`
                            : 'bg-white text-[#4B5563] border border-[#E5E7EB] hover:border-[#111827]'
                        }`}
                      >
                        <span>{flavor.name.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3D Kinetic Tilt Card */}
              <div
                ref={cardRef}
                onMouseMove={handleCardMouseMove}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={handleCardMouseLeave}
                style={{
                  transform: `perspective(1000px) rotateX(${cardTilt.x}deg) rotateY(${cardTilt.y}deg) scale3d(${isHovered ? 1.02 : 1}, ${isHovered ? 1.02 : 1}, 1)`,
                  transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
                }}
                className={`relative bg-gradient-to-br ${activeFlavor.gradientCard} rounded-3xl p-6 sm:p-8 border-3 ${activeFlavor.borderStyle} shadow-3d-card preserve-3d cursor-pointer`}
              >
                
                {/* 3D Holographic Glare Overlay */}
                <div
                  className="absolute inset-0 rounded-3xl pointer-events-none opacity-40 transition-opacity"
                  style={{
                    background: `radial-gradient(circle at ${(cardTilt.y / 18 + 0.5) * 100}% ${(cardTilt.x / -18 + 0.5) * 100}%, rgba(255,255,255,0.8), transparent 70%)`,
                  }}
                />

                {/* Top 3D Floating Tags */}
                <div className="flex items-center justify-between relative z-20 mb-4 translate-z-8">
                  <span className={`${activeFlavor.accentBg} text-white text-[10px] sm:text-xs font-heading font-black uppercase tracking-wider px-3 py-1 rounded-xl shadow-md border border-white/30 flex items-center gap-1`}>
                    <Sparkles className="w-3 h-3 text-[#FFD043]" />
                    {activeFlavor.badge}
                  </span>

                  <span className="bg-white/95 text-[#111827] text-[10px] sm:text-xs font-heading font-black uppercase tracking-wider px-3 py-1 rounded-xl shadow-xs border border-black/10">
                    {activeFlavor.oilPurity}
                  </span>
                </div>

                {/* 3D Floating Plate with Parallax & Cast Shadow */}
                <div className="relative my-4 text-center translate-z-12">
                  <div className="relative mx-auto w-56 h-56 sm:w-68 sm:h-68 rounded-full p-3 bg-white/90 backdrop-blur-md border-4 border-white shadow-3d-plate animate-float-slow">
                    <img
                      src={activeFlavor.image}
                      alt={activeFlavor.name}
                      className="w-full h-full object-cover rounded-full shadow-inner transform hover:rotate-6 hover:scale-108 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=500&q=80';
                      }}
                    />

                    {/* 3D Floating Provenance Pin */}
                    <div className="absolute -bottom-2 -right-1 bg-white text-[#111827] border-2 border-[#111827] rounded-2xl px-3 py-1.5 shadow-[0_4px_0_#111827] text-left transform rotate-3">
                      <p className="text-[9px] font-heading font-black uppercase text-[#FF3815]">Kadai Fresh</p>
                      <p className="font-heading font-black text-xs text-[#111827]">Rajkot Kitchen</p>
                    </div>
                  </div>
                </div>

                {/* Flavor Profile Specs & Dynamic Control Bar */}
                <div className="space-y-4 bg-white/95 backdrop-blur-md rounded-2xl p-5 border-2 border-[#111827] shadow-[0_6px_0_#111827] relative z-20 translate-z-8">
                  
                  <div className="flex items-start justify-between gap-3 border-b border-[#F0E6D8] pb-3">
                    <div>
                      <h3 className="font-heading font-black text-2xl text-[#111827]">
                        {activeFlavor.name}
                      </h3>
                      <p className="text-xs text-[#4B5563] font-medium">
                        {activeFlavor.tagline}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="font-heading font-black text-2xl sm:text-3xl text-[#FF3815] leading-none block">
                        ₹{currentHeroPrice}
                      </span>
                      <span className="text-[10px] text-[#4B5563] font-mono">
                        (₹{activeFlavor.pricePerKg}/kg)
                      </span>
                    </div>
                  </div>

                  {/* 3D Haptic Crunch & Flavor Indicators */}
                  <div className="grid grid-cols-3 gap-2 text-[10px] sm:text-xs font-heading font-bold text-center">
                    <div className="bg-[#FFF5EC] p-2 rounded-xl border border-[#FF3815]/20">
                      <span className="text-[#FF3815] block font-black">Heat Meter</span>
                      <span className="text-[#111827] truncate block mt-0.5">{activeFlavor.spiceScore.split(' ')[0]} Spicy</span>
                    </div>

                    <div className="bg-[#E8FDF5] p-2 rounded-xl border border-[#00C076]/20">
                      <span className="text-[#00C076] block font-black">Crunch Index</span>
                      <span className="text-[#111827] truncate block mt-0.5">{activeFlavor.crunchDecibels} ({activeFlavor.crunchDescriptor})</span>
                    </div>

                    <div className="bg-[#FFFBEB] p-2 rounded-xl border border-[#FFB800]/30">
                      <span className="text-[#B45309] block font-black">Best Pairing</span>
                      <span className="text-[#111827] truncate block mt-0.5">☕ Masala Chai</span>
                    </div>
                  </div>

                  {/* Dynamic Weight Picker & 3D Add Button */}
                  <div className="pt-1 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5 w-full sm:w-auto justify-center">
                      <span className="text-xs font-heading font-bold text-[#4B5563] mr-1">Size:</span>
                      {[250, 500, 1000, 2000].map((w) => (
                        <button
                          key={w}
                          type="button"
                          onClick={() => setHeroWeight(w)}
                          className={`px-3 py-1 rounded-xl text-xs font-heading font-extrabold transition-all cursor-pointer ${
                            heroWeight === w
                              ? 'bg-[#111827] text-white shadow-sm'
                              : 'bg-[#FFF9F2] text-[#111827] border border-[#F0E6D8] hover:border-[#111827]'
                          }`}
                        >
                          {w >= 1000 ? `${w / 1000}kg` : `${w}g`}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={handleQuickAddHero}
                      className="w-full sm:w-auto flex-1 bg-[#FF3815] hover:bg-[#D92B0C] text-white py-3 px-5 rounded-xl font-heading font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_4px_0_#A31A03] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
                    >
                      {heroAddedNotice ? (
                        <>
                          <Check className="w-4 h-4 text-[#FFD043]" />
                          <span>Added to Cart!</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 text-white" />
                          <span>Add to My Dabba • ₹{currentHeroPrice}</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ========================================================
          2. THE CRUNCH-O-METER: INTERACTIVE AUDIO/VISUAL LAB
         ======================================================== */}
      <section className="bg-gradient-to-r from-[#111827] via-[#1F2937] to-[#111827] text-white py-12 px-4 sm:px-6 lg:px-8 border-y-4 border-[#FF3815] relative overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-[#FF3815] text-white px-3 py-1 rounded-full text-[10px] font-heading font-black uppercase tracking-wider">
              <Volume2 className="w-3.5 h-3.5" />
              <span>Acoustic Crunch Science</span>
            </div>
            <h2 className="font-heading font-black text-2xl sm:text-3xl text-white">
              The 105 dB Kathiyawadi Shatter Test
            </h2>
            <p className="text-xs sm:text-sm text-white/75 font-sans max-w-lg">
              Pure cold-filtered Sing-Tel expands the besan crumb structure without absorbing oil weight, delivering a clean acoustic snap verified by food science.
            </p>
          </div>

          {/* Equalizer Visualizer Bars */}
          <div className="flex items-center gap-6 bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20">
            <div className="flex items-end gap-1.5 h-12">
              <span className="w-2 bg-[#FF3815] rounded-full h-6 animate-pulse" />
              <span className="w-2 bg-[#FF8A00] rounded-full h-10 animate-bounce" />
              <span className="w-2 bg-[#FFB800] rounded-full h-8 animate-pulse" />
              <span className="w-2 bg-[#00C076] rounded-full h-12 animate-bounce" />
              <span className="w-2 bg-[#7C3AED] rounded-full h-7 animate-pulse" />
            </div>

            <div className="text-left">
              <span className="text-[10px] font-heading font-black text-white/60 uppercase block">Certified Crispness</span>
              <span className="font-heading font-black text-2xl text-[#FFD043]">99.8% Snap</span>
              <span className="text-[10px] text-white/80 block">Zero Chewiness • Zero Sogginess</span>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================
          3. 3D BENTO GRID: WHY OUR NASTA HITS COMPLETELY DIFFERENT
         ======================================================== */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#E8FDF5] text-[#00C076] text-xs font-heading font-black uppercase tracking-wider border-2 border-[#00C076]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Gold Standard of Farsan</span>
          </div>
          <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#111827] tracking-tight">
            Why our snacks hit <span className="bg-gradient-to-r from-[#FF3815] via-[#FF8A00] to-[#00C076] bg-clip-text text-transparent">completely different</span>
          </h2>
          <p className="text-sm sm:text-base text-[#4B5563] font-sans leading-relaxed">
            Forget greased fingers, throat irritation, and heavy stomach burn. Experience authentic Kathiyawadi farsan made the right way.
          </p>
        </div>

        {/* 4 Colorful 3D Bento Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Sing-Tel Green */}
          <div className="bg-[#E8FDF5] border-3 border-[#00C076] rounded-3xl p-6 shadow-3d-green hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#00C076] text-white flex items-center justify-center font-black text-2xl shadow-md border-2 border-[#111827]">
                🌱
              </div>
              <h3 className="font-heading font-black text-xl text-[#065F46]">
                100% Saurashtra Sing-Tel
              </h3>
              <p className="text-xs text-[#047857] font-semibold leading-relaxed">
                Cold-filtered pure groundnut oil with a high smoke point. Never blended with cheap palm oil. Your fingers stay dry and clean.
              </p>
            </div>
            <div className="pt-3 border-t border-[#00C076]/30 flex items-center justify-between text-xs font-heading font-black text-[#00C076]">
              <span>Zero Trans-Fats</span>
              <span>✦ Heart Friendly</span>
            </div>
          </div>

          {/* Card 2: Turmeric Mango Gold */}
          <div className="bg-[#FFFBEB] border-3 border-[#FFB800] rounded-3xl p-6 shadow-3d-yellow hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#FFB800] text-[#111827] flex items-center justify-center font-black text-2xl shadow-md border-2 border-[#111827]">
                ♨️
              </div>
              <h3 className="font-heading font-black text-xl text-[#92400E]">
                Dawn Kadai Batches
              </h3>
              <p className="text-xs text-[#B45309] font-semibold leading-relaxed">
                Fried every single morning before 5:00 AM in small 15kg iron kadais. Packed and shipped the exact same day.
              </p>
            </div>
            <div className="pt-3 border-t border-[#FFB800]/40 flex items-center justify-between text-xs font-heading font-black text-[#B45309]">
              <span>Small Batch Care</span>
              <span>✦ Never Stale</span>
            </div>
          </div>

          {/* Card 3: Saffron Chili Red */}
          <div className="bg-[#FFF1EE] border-3 border-[#FF3815] rounded-3xl p-6 shadow-3d-card hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#FF3815] text-white flex items-center justify-center font-black text-2xl shadow-md border-2 border-[#111827]">
                🧂
              </div>
              <h3 className="font-heading font-black text-xl text-[#991B1B]">
                Ayurvedic Digestive Spices
              </h3>
              <p className="text-xs text-[#B91C1C] font-semibold leading-relaxed">
                Stone-ground Bhavnagari hing (asafoetida), whole ajwain, and cracked black pepper aid digestion without throat heaviness.
              </p>
            </div>
            <div className="pt-3 border-t border-[#FF3815]/30 flex items-center justify-between text-xs font-heading font-black text-[#FF3815]">
              <span>Pure Hing & Mari</span>
              <span>✦ Light Stomach</span>
            </div>
          </div>

          {/* Card 4: Royal Purple */}
          <div className="bg-[#F5F3FF] border-3 border-[#7C3AED] rounded-3xl p-6 shadow-3d-purple hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#7C3AED] text-white flex items-center justify-center font-black text-2xl shadow-md border-2 border-[#111827]">
                📦
              </div>
              <h3 className="font-heading font-black text-xl text-[#5B21B6]">
                Aroma-Lock Barrier Pouch
              </h3>
              <p className="text-xs text-[#6D28D9] font-semibold leading-relaxed">
                Multi-layer food-grade barrier pouches with nitrogen flush retain 100% of the morning kadai crispness for 90 days.
              </p>
            </div>
            <div className="pt-3 border-t border-[#7C3AED]/30 flex items-center justify-between text-xs font-heading font-black text-[#7C3AED]">
              <span>90-Day Freshness</span>
              <span>✦ Leak-Proof</span>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================
          4. INTERACTIVE 3D "BUILD YOUR DABBA" LIVE EXPERIMENT
         ======================================================== */}
      <section className="bg-gradient-to-br from-[#FFF9F2] via-[#FFF3E8] to-[#FFF9F2] py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-y-2 border-[#F0E6D8]">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <div className="inline-flex items-center gap-2 bg-[#FF3815] text-white px-3.5 py-1 rounded-full text-xs font-heading font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#FFD043]" />
              <span>Interactive Hamper Studio</span>
            </div>
            <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#111827] tracking-tight">
              Build your customized <span className="text-[#FF3815]">Kathiyawadi Dabba</span>
            </h2>
            <p className="text-sm sm:text-base text-[#4B5563] font-sans">
              Click to select snacks into your custom 4-pack gift tin. Live weight & price recalculate dynamically!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Interactive Snack Slot Selector */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {dabbaItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleDabbaItem(item.id)}
                  className={`p-5 rounded-3xl border-3 transition-all cursor-pointer flex items-center justify-between ${
                    item.added
                      ? 'bg-white border-[#FF3815] shadow-3d-card scale-102'
                      : 'bg-white/80 border-[#F0E6D8] hover:border-[#111827] opacity-75'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-[#FFF5EC] border-2 border-[#111827] flex items-center justify-center font-black text-lg">
                      {item.id === 'gathiya' && '🌶️'}
                      {item.id === 'chevdo' && '🌾'}
                      {item.id === 'chakdi' && '🌀'}
                      {item.id === 'sev-mamra' && '💛'}
                    </div>
                    <div>
                      <h4 className="font-heading font-black text-base text-[#111827]">
                        {item.name}
                      </h4>
                      <span className="text-xs text-[#4B5563] font-bold">
                        {item.weight}g Pack • ₹{item.price}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center font-black ${
                      item.added
                        ? 'bg-[#FF3815] border-[#FF3815] text-white shadow-xs'
                        : 'border-[#DECFC0] text-[#DECFC0]'
                    }`}
                  >
                    {item.added ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </div>
                </div>
              ))}
            </div>

            {/* Right: 3D Dabba Presentation Box Visual */}
            <div className="lg:col-span-5 perspective-1000">
              <div className="bg-[#111827] text-white rounded-3xl p-6 sm:p-8 border-4 border-[#111827] shadow-[0_16px_0_#4B5563] space-y-6">
                
                <div className="flex items-center justify-between border-b border-white/20 pb-4">
                  <div>
                    <span className="text-[10px] font-heading font-black uppercase text-[#FFD043] tracking-widest block">
                      Custom Hamper Tin
                    </span>
                    <h3 className="font-heading font-black text-xl text-white">
                      The Kathiyawad Dabba
                    </h3>
                  </div>
                  <span className="bg-[#FF3815] text-white font-heading font-black text-xs px-3 py-1 rounded-xl shadow-xs">
                    {dabbaActiveItems.length} of 4 Selected
                  </span>
                </div>

                {/* 4 Dabba Slots Visual */}
                <div className="grid grid-cols-2 gap-3">
                  {[0, 1, 2, 3].map((slotIdx) => {
                    const slotItem = dabbaActiveItems[slotIdx];
                    return (
                      <div
                        key={slotIdx}
                        className={`h-24 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-3 text-center transition-all ${
                          slotItem
                            ? 'bg-white/10 border-[#FFD043] text-white'
                            : 'border-white/20 text-white/40'
                        }`}
                      >
                        {slotItem ? (
                          <>
                            <span className="font-heading font-black text-xs text-[#FFD043] truncate">
                              ✓ {slotItem.name}
                            </span>
                            <span className="text-[10px] text-white/70 mt-1">
                              {slotItem.weight}g Pack
                            </span>
                          </>
                        ) : (
                          <span className="text-[11px] font-heading font-bold">
                            + Empty Slot {slotIdx + 1}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Dabba Price & Add Action */}
                <div className="pt-2 border-t border-white/15 space-y-4">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-xs text-white/70 block">Total Net Weight:</span>
                      <span className="font-mono font-black text-sm text-white">
                        {dabbaTotalGrams / 1000} kg ({dabbaTotalGrams}g)
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-white/70 block">Hamper Total:</span>
                      <span className="font-heading font-black text-3xl text-[#FFD043]">
                        ₹{dabbaTotalPrice}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleAddDabbaToCart}
                    disabled={dabbaActiveItems.length === 0}
                    className="w-full bg-[#FF3815] hover:bg-[#D92B0C] text-white py-4 rounded-2xl font-heading font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_6px_0_#A31A03] active:translate-y-1.5 active:shadow-none transition-all cursor-pointer disabled:opacity-40"
                  >
                    <Package className="w-5 h-5 text-[#FFD043]" />
                    <span>Pack This Dabba • ₹{dabbaTotalPrice}</span>
                  </button>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================
          5. BESTSELLING SNACKS WITH DYNAMIC WEIGHT CONTROLS
         ======================================================== */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-heading font-black uppercase tracking-wider text-[#FF3815] bg-[#FFF1EE] px-3.5 py-1 rounded-full mb-2 border border-[#FF3815]/20">
              <Sparkles className="w-3.5 h-3.5 text-[#FFB800]" />
              Saurashtra Kitchen Direct
            </div>
            <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#111827] tracking-tight">
              Our Bestselling <span className="text-[#FF3815]">Farsan & Namkeen</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#4B5563] font-sans mt-1">
              Select 250g, 500g, 1kg or 2kg packs with instant per-gram dynamic price updates.
            </p>
          </div>

          <Link
            to="/snacks"
            className="inline-flex items-center gap-2 text-sm font-heading font-black text-[#FF3815] hover:text-[#D92B0C] transition-colors"
          >
            <span>View Full Shop Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Category Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none mb-8">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-heading font-black uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#FF3815] text-white shadow-[0_4px_0_#A31A03]'
                : 'bg-white text-[#111827] border border-[#F0E6D8] hover:border-[#FF3815]'
            }`}
          >
            All Snacks ({products.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setSelectedCategory(cat._id)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-heading font-black uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat._id
                  ? 'bg-[#FF3815] text-white shadow-[0_4px_0_#A31A03]'
                  : 'bg-white text-[#111827] border border-[#F0E6D8] hover:border-[#FF3815]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl h-80 animate-pulse border border-[#F0E6D8]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.slice(0, 8).map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>
        )}
      </section>

      {/* ========================================================
          6. THE SING-TEL EXPERIMENT: GREASE-FREE FINGER TEST
         ======================================================== */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-heading font-black uppercase tracking-wider text-[#00C076] bg-[#E8FDF5] px-3.5 py-1 rounded-full border-2 border-[#00C076]">
            The Finger Tissue Test
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#111827]">
            Eat With Your Fingers. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#FF3815] to-[#FFB800] bg-clip-text text-transparent">
              Never Suffer From Palm Oil Grease.
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Side A: Giriraj Sing-Tel */}
          <div className="bg-[#E8FDF5] rounded-3xl p-6 sm:p-8 border-3 border-[#00C076] shadow-3d-green space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-heading font-black text-xl text-[#065F46]">
                Giriraj Kathiyawadi Farsan
              </span>
              <span className="bg-[#00C076] text-white text-xs px-3 py-1 rounded-xl font-black">
                ✓ 100% PURE
              </span>
            </div>

            <ul className="space-y-3 text-xs sm:text-sm font-sans font-bold text-[#065F46]">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#00C076] shrink-0" />
                <span>Fried exclusively in pure filtered groundnut oil (Sing-Tel)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#00C076] shrink-0" />
                <span>Tissue paper stays dry — zero oily residue on fingers</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#00C076] shrink-0" />
                <span>Zero throat burns, light on digestion, heart friendly</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#00C076] shrink-0" />
                <span>Kadai-fried before dawn in Rajkot and shipped directly</span>
              </li>
            </ul>
          </div>

          {/* Side B: Commercial Supermarket Namkeen */}
          <div className="bg-[#FFF1EE] rounded-3xl p-6 sm:p-8 border-2 border-[#FF3815]/30 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-heading font-black text-xl text-[#991B1B]">
                Factory Commercial Namkeen
              </span>
              <span className="bg-[#991B1B] text-white text-xs px-3 py-1 rounded-xl font-black">
                ❌ PALM OIL BLENDS
              </span>
            </div>

            <ul className="space-y-3 text-xs sm:text-sm font-sans font-semibold text-[#7F1D1D]">
              <li className="flex items-center gap-2.5">
                <span className="text-red-500 font-black text-base shrink-0">✕</span>
                <span>Cheap commercial palm oil & cottonseed oil blends</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="text-red-500 font-black text-base shrink-0">✕</span>
                <span>Greasy coating on fingertips and palate</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="text-red-500 font-black text-base shrink-0">✕</span>
                <span>Heavy throat fullness and acid reflux</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="text-red-500 font-black text-base shrink-0">✕</span>
                <span>Mass produced in factory warehouses months ago</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ========================================================
          7. REVIEWS COMMUNITY: LOVED BY 14,200+ SNACKERS
         ======================================================== */}
      <section className="bg-gradient-to-b from-[#FFFDF9] via-[#FFF8F0] to-[#FFFDF9] py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-y-2 border-[#F0E6D8]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            <div className="lg:col-span-4 space-y-5">
              <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#111827] tracking-tight">
                Loved by<br />
                <span className="bg-gradient-to-r from-[#FF3815] to-[#FFB800] bg-clip-text text-transparent">14,200+ snackers</span>
              </h2>

              <p className="text-sm text-[#4B5563] font-sans leading-relaxed">
                Real reviews from Gujarati families across Rajkot, Ahmedabad, Surat, Mumbai, London, and New Jersey.
              </p>

              <div>
                <Link
                  to="/snacks"
                  className="inline-flex items-center gap-2 bg-[#111827] hover:bg-[#FF3815] text-white font-heading font-black text-xs uppercase tracking-wider px-6 py-4 rounded-2xl shadow-[0_4px_0_#4B5563] active:translate-y-1 transition-all"
                >
                  <span>Explore More Snacks</span>
                  <ArrowRight className="w-4 h-4 text-[#FFD043]" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
              
              {/* Review 1 */}
              <div className="bg-white rounded-3xl p-6 shadow-gourmet border-2 border-[#00C076] flex flex-col justify-between space-y-4 hover:-translate-y-1.5 transition-transform">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#00C076] text-white flex items-center justify-center font-heading font-black text-sm shadow-xs">
                      MP
                    </div>
                    <div>
                      <div className="font-heading font-black text-sm text-[#111827]">Mehul Patel</div>
                      <div className="flex text-[#FFB800] text-xs">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-[#FFB800]" />
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-[#4B5563] font-sans leading-relaxed">
                    "These snacks are ridiculously fresh! Authentic Kathiyawadi flavour. The Sing-Tel aroma hits the moment you tear open the pouch."
                  </p>
                </div>

                <div>
                  <span className="inline-block bg-[#E8FDF5] text-[#00C076] text-[10px] font-heading font-black px-3 py-1 rounded-full">
                    Poha Chevdo
                  </span>
                </div>
              </div>

              {/* Review 2 */}
              <div className="bg-white rounded-3xl p-6 shadow-gourmet border-2 border-[#FF3815] flex flex-col justify-between space-y-4 hover:-translate-y-1.5 transition-transform">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#FF3815] text-white flex items-center justify-center font-heading font-black text-sm shadow-xs">
                      PS
                    </div>
                    <div>
                      <div className="font-heading font-black text-sm text-[#111827]">Pooja Shah</div>
                      <div className="flex text-[#FFB800] text-xs">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-[#FFB800]" />
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-[#4B5563] font-sans leading-relaxed">
                    "Zero greasiness on fingers! The spicy Tikha Gathiya with evening chai is unmatched. Crispiness lasted over a month."
                  </p>
                </div>

                <div>
                  <span className="inline-block bg-[#FFF1EE] text-[#FF3815] text-[10px] font-heading font-black px-3 py-1 rounded-full">
                    Tikha Gathiya
                  </span>
                </div>
              </div>

              {/* Review 3 */}
              <div className="bg-white rounded-3xl p-6 shadow-gourmet border-2 border-[#FFB800] flex flex-col justify-between space-y-4 hover:-translate-y-1.5 transition-transform">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#FFB800] text-[#111827] flex items-center justify-center font-heading font-black text-sm shadow-xs">
                      DK
                    </div>
                    <div>
                      <div className="font-heading font-black text-sm text-[#111827]">Dipenbhai K.</div>
                      <div className="flex text-[#FFB800] text-xs">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-[#FFB800]" />
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-[#4B5563] font-sans leading-relaxed">
                    "High quality, superb crunch, and speedy delivery in Mumbai. The Chakdi arrived completely whole without breakage."
                  </p>
                </div>

                <div>
                  <span className="inline-block bg-[#FFFBEB] text-[#B45309] text-[10px] font-heading font-black px-3 py-1 rounded-full">
                    Chakdi & Sing
                  </span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ========================================================
          8. GRAND 3D ACTION CALLOUT
         ======================================================== */}
      <section className="bg-gradient-to-r from-[#FF3815] via-[#FF5722] to-[#FF3815] text-white py-16 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden shadow-2xl">
        <div className="max-w-3xl mx-auto space-y-6 relative z-10">
          <h2 className="font-heading font-black text-4xl sm:text-6xl text-white tracking-tight">
            Ready to snack <span className="underline decoration-[#FFD043] decoration-wavy">better?</span>
          </h2>

          <p className="text-sm sm:text-base text-white/90 font-sans max-w-xl mx-auto leading-relaxed">
            Order your favorite Kathiyawadi snacks freshly fried in 100% pure Sing-Tel, delivered fast across India in flexible 250g to 2kg packs.
          </p>

          <div className="pt-2">
            <Link
              to="/snacks"
              className="inline-flex items-center gap-3 bg-[#111827] hover:bg-black text-white font-heading font-black text-base px-10 py-4 rounded-2xl shadow-[0_6px_0_#4B5563] active:translate-y-1.5 active:shadow-none transition-all cursor-pointer"
            >
              <span>Explore All Snacks</span>
              <ArrowRight className="w-5 h-5 text-[#FFD043]" />
            </Link>
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
