import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { Sparkles, Flame, Leaf, Award, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutUs = () => {
  const { settings } = useSettings();

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-12 sm:py-16 text-[#1C1815]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EBF4EF] text-[#14382B] text-xs font-bold border border-[#14382B]/15">
            <Sparkles className="w-3.5 h-3.5 text-[#D89B2B]" />
            <span>Heritage Archive • Rajkot, Saurashtra</span>
            <span className="font-script text-base text-[#C84B20]">Pure Sing-Tel ✦</span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-5xl text-[#14382B] tracking-tight">
            Our Kitchen Story & Philosophy
          </h1>
          <p className="text-sm sm:text-base text-[#6E675F] font-sans leading-relaxed">
            How an independent family kitchen in Rajkot continues to preserve ancestral Kathiyawadi farsan techniques without industrial shortcuts or palm oil.
          </p>
        </div>

        {/* Narrative & Image Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="md:col-span-6 space-y-5 text-sm sm:text-base text-[#6E675F] font-sans leading-relaxed">
            <div className="space-y-1">
              <span className="font-script text-2xl text-[#C84B20]">Real ingredients. Real flavour.</span>
              <h2 className="font-heading font-black text-2xl sm:text-3xl text-[#14382B]">
                100% Saurashtra Sing-Tel. <br />
                Zero Palm Oil Blends.
              </h2>
            </div>
            <p>
              {settings.policies?.aboutUs ||
                'Giriraj Homemade Gujarati Snacks began in our family kitchen in Rajkot with an uncompromising commitment to authentic taste, hand-selected spices, pure sing-tel (groundnut oil), and zero artificial preservatives. Every batch of Gathiya, Chevdo, Chakdi, and Sev is hand-crafted following time-tested ancestral recipes.'}
            </p>
            <p>
              Unlike commercial factories that dilute batches with low-grade palm oil and synthetic aromatics, we hold that authentic Gujarati farsan acquires its delicate crispness and signature aroma exclusively from 100% pure filtered Saurashtra groundnut oil.
            </p>
            <p>
              When you purchase snacks from us, you receive food prepared fresh that very morning by experienced home cooks, sealed immediately in barrier pouches to guarantee optimal crispness.
            </p>
            <div className="pt-2">
              <Link
                to="/snacks"
                className="inline-flex items-center gap-2 bg-[#C84B20] hover:bg-[#A33A16] text-white text-xs sm:text-sm font-semibold px-6 py-3.5 rounded-full transition-all shadow-warm-glow cursor-pointer"
              >
                <span>Explore Our Fresh Batches →</span>
              </Link>
            </div>
          </div>

          <div className="md:col-span-6">
            <div className="bg-white p-4 rounded-3xl border border-[#EAE3D9] shadow-gourmet space-y-3">
              <div className="aspect-4/3 rounded-2xl overflow-hidden bg-[#FAF7F2]">
                <img
                  src="/images/snacks/tikha-gathiya.jpg"
                  alt="Traditional Morning Kadhais in Rajkot"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex items-center justify-between px-2 pt-1 text-xs text-[#6E675F] font-medium">
                <span className="flex items-center gap-1.5 text-[#14382B] font-bold">
                  <Flame className="w-3.5 h-3.5 text-[#C84B20]" /> Daily Morning Kadhais
                </span>
                <span>Rajkot, Gujarat</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-3xl border border-[#EAE3D9] space-y-3 shadow-gourmet">
            <div className="w-12 h-12 rounded-2xl bg-[#EBF4EF] text-[#14382B] flex items-center justify-center shadow-xs">
              <Leaf className="w-6 h-6 text-[#14382B]" />
            </div>
            <h3 className="font-heading font-black text-lg text-[#14382B]">
              Stone-Ground Ingredients
            </h3>
            <p className="text-xs sm:text-sm text-[#6E675F] font-sans leading-relaxed">
              Fresh chickpea flour, freshly cracked black pepper (mari), ajwain seeds, and Saurashtra rock salt. No artificial colours or chemicals.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#EAE3D9] space-y-3 shadow-gourmet">
            <div className="w-12 h-12 rounded-2xl bg-[#FDF4EC] text-[#C84B20] flex items-center justify-center shadow-xs">
              <Flame className="w-6 h-6 text-[#C84B20]" />
            </div>
            <h3 className="font-heading font-black text-lg text-[#14382B]">
              Daily Morning Batches
            </h3>
            <p className="text-xs sm:text-sm text-[#6E675F] font-sans leading-relaxed">
              Fried before dawn in small controlled rounds to eliminate warehouse resting time. Never stale warehouse inventory.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#EAE3D9] space-y-3 shadow-gourmet">
            <div className="w-12 h-12 rounded-2xl bg-[#FDF7EB] text-[#D89B2B] flex items-center justify-center shadow-xs">
              <Award className="w-6 h-6 text-[#D89B2B]" />
            </div>
            <h3 className="font-heading font-black text-lg text-[#14382B]">
              Rajkot Provenance
            </h3>
            <p className="text-xs sm:text-sm text-[#6E675F] font-sans leading-relaxed">
              Proudly rooted in Saurashtra culture. Local fast delivery in Rajkot; tracked express courier nationwide across India.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
