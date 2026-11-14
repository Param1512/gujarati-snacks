import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { Sparkles, Flame, Leaf, Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutUs = () => {
  const { settings } = useSettings();

  return (
    <div className="min-h-screen bg-[#FFF9F2] py-16 sm:py-24 text-[#21191A] font-sans selection:bg-[#790B13] selection:text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Editorial Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF0DC] border border-[#D6B77A]/40 text-[#790B13] text-xs font-mono uppercase tracking-widest shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#D6B77A]" />
            <span>Heritage Archive • Rajkot, Saurashtra</span>
            <span className="text-[#D6B77A]">✦ Pure Groundnut Oil</span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-6xl text-[#21191A] uppercase tracking-tight leading-none">
            Our Kitchen <span className="font-serif italic font-normal lowercase text-[#790B13]">heritage</span> & Philosophy
          </h1>
          <p className="text-sm sm:text-base text-[#21191A]/70 font-sans leading-relaxed">
            How an independent family culinary atelier in Rajkot preserves ancestral Kathiyawadi farsan techniques without industrial shortcuts or palm oil.
          </p>
        </div>

        {/* Narrative & Visual Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="md:col-span-6 space-y-6 text-sm sm:text-base text-[#21191A]/80 font-sans leading-relaxed">
            <div className="space-y-2">
              <span className="font-serif italic text-2xl text-[#790B13] block">Real ingredients. Authentic legacy.</span>
              <h2 className="font-heading font-black text-2xl sm:text-4xl text-[#21191A] uppercase tracking-tight">
                100% Saurashtra Sing-Tel. <br />
                <span className="text-[#790B13]">Zero Palm Oil Compromises.</span>
              </h2>
            </div>
            <p>
              {settings.policies?.aboutUs ||
                'Gujarati Homemade Nasta & Snacks began in our family kitchen in Rajkot with an uncompromising commitment to authentic taste, hand-selected spices, pure sing-tel (groundnut oil), and zero artificial preservatives. Every batch of Gathiya, Chevdo, Chakdi, and Sev is hand-crafted following time-tested ancestral recipes.'}
            </p>
            <p>
              Unlike commercial factories that dilute batches with low-grade palm oil and synthetic aromatics, we hold that authentic Gujarati farsan acquires its delicate crispness and signature aroma exclusively from 100% pure filtered Saurashtra groundnut oil.
            </p>
            <p>
              When you purchase snacks from us, you receive food prepared with genuine care by experienced home cooks, sealed immediately in airtight pouches to guarantee optimal crispness.
            </p>
            <div className="pt-2">
              <Link
                to="/snacks"
                className="inline-flex items-center gap-2 bg-[#790B13] hover:bg-[#50000D] text-[#FFF0DC] text-xs font-mono uppercase tracking-widest font-bold px-8 py-4 rounded-full transition-all shadow-lg shadow-[#790B13]/25 cursor-pointer group"
              >
                <span>Explore Our Snack Collection</span>
                <ArrowRight className="w-4 h-4 text-[#D6B77A] group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="md:col-span-6">
            <div className="bg-white p-5 rounded-3xl border border-[#D6B77A]/30 shadow-2xl space-y-4">
              <div className="aspect-4/3 rounded-2xl overflow-hidden bg-[#FFF9F2] border border-[#D6B77A]/20">
                <img
                  src="/images/snacks/tikha-gathiya.jpg"
                  alt="Traditional Homemade Farsan in Rajkot"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="flex items-center justify-between px-3 pt-2 text-xs text-[#21191A]/70 font-mono uppercase">
                <span className="flex items-center gap-2 text-[#790B13] font-bold">
                  <Flame className="w-4 h-4 text-[#D6B77A]" /> Authentic Homemade Taste
                </span>
                <span>Rajkot, Gujarat</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Luxury Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#D6B77A]/30 space-y-4 shadow-lg hover:border-[#790B13]/40 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-[#FFF0DC] text-[#790B13] flex items-center justify-center border border-[#D6B77A]/40 shadow-xs">
              <Leaf className="w-7 h-7 text-[#790B13]" />
            </div>
            <h3 className="font-heading font-black text-xl text-[#21191A] uppercase tracking-tight">
              Stone-Ground Ingredients
            </h3>
            <p className="text-xs sm:text-sm text-[#21191A]/70 font-sans leading-relaxed">
              Fresh chickpea flour, freshly cracked black pepper (mari), ajwain seeds, and Saurashtra rock salt. No artificial colours or chemicals.
            </p>
          </div>

          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#D6B77A]/30 space-y-4 shadow-lg hover:border-[#790B13]/40 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-[#FFF0DC] text-[#790B13] flex items-center justify-center border border-[#D6B77A]/40 shadow-xs">
              <Flame className="w-7 h-7 text-[#790B13]" />
            </div>
            <h3 className="font-heading font-black text-xl text-[#21191A] uppercase tracking-tight">
              Traditional Preparation
            </h3>
            <p className="text-xs sm:text-sm text-[#21191A]/70 font-sans leading-relaxed">
              Handcrafted in small artisanal batches following time-tested ancestral recipes. Pure taste with zero compromises.
            </p>
          </div>

          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#D6B77A]/30 space-y-4 shadow-lg hover:border-[#790B13]/40 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-[#FFF0DC] text-[#790B13] flex items-center justify-center border border-[#D6B77A]/40 shadow-xs">
              <Award className="w-7 h-7 text-[#790B13]" />
            </div>
            <h3 className="font-heading font-black text-xl text-[#21191A] uppercase tracking-tight">
              Rajkot Provenance
            </h3>
            <p className="text-xs sm:text-sm text-[#21191A]/70 font-sans leading-relaxed">
              Proudly rooted in Saurashtra culture. Local fast delivery in Rajkot; tracked express courier nationwide across India.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
