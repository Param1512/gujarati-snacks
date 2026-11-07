import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useSettings } from '../../context/SettingsContext';
import { Globe, Truck, Sparkles, ShieldCheck } from 'lucide-react';

const AnnouncementBar = () => {
  const { language, setLanguage } = useLanguage();
  const { settings } = useSettings();

  return (
    <div className="bg-[#14382B] text-white text-xs border-b border-[#0D261C] py-2 px-4 sm:px-6 tracking-wide">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left Side: Delivery Notice & Quality Pill */}
        <div className="flex items-center gap-2.5">
          <span className="flex items-center gap-1.5 bg-[#1D4E3C] text-[#F7C04A] px-2.5 py-0.5 rounded-full font-heading text-[10px] sm:text-[11px] font-bold uppercase tracking-wider shadow-xs">
            <Sparkles className="w-3 h-3 text-[#F7C04A]" />
            100% Pure Sing-Tel
          </span>
          <span className="text-white/40 hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5 text-white/90 font-medium text-[11px] sm:text-xs">
            <Truck className="w-3.5 h-3.5 text-[#F7C04A] shrink-0" />
            <span>
              Free Doorstep Delivery on orders above <strong className="text-white font-bold">₹{settings?.freeDeliveryThreshold || 999}</strong>
            </span>
          </div>
        </div>

        {/* Right Side: Morning Frying Batch & Language Switcher */}
        <div className="flex items-center gap-3.5">
          <div className="hidden md:flex items-center gap-1.5 text-[11px] text-[#F7C04A] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F7C04A] animate-pulse" />
            <span>Morning Kadai Batch: Fresh from Rajkot</span>
          </div>

          <div className="flex items-center gap-1.5 border-l border-white/15 pl-3">
            <Globe className="w-3.5 h-3.5 text-white/70" />
            <button
              onClick={() => setLanguage('en')}
              className={`text-[10px] font-heading font-bold uppercase tracking-wider px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                language === 'en'
                  ? 'bg-[#F7C04A] text-[#14382B] font-extrabold shadow-xs'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('gu')}
              className={`text-[10px] font-heading font-bold uppercase tracking-wider px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                language === 'gu'
                  ? 'bg-[#F7C04A] text-[#14382B] font-extrabold shadow-xs'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              ગુજ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;
