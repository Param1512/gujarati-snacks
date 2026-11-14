import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useSettings } from '../../context/SettingsContext';
import { Globe, Truck, Sparkles, ShieldCheck } from 'lucide-react';

const AnnouncementBar = () => {
  const { language, setLanguage } = useLanguage();
  const { settings } = useSettings();

  return (
    <div className="bg-[#3A000A] text-[#FFF0DC] text-xs border-b border-[#D6B77A]/20 py-2 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left Side: Quality Seal & Delivery Policy */}
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 bg-[#50000D] text-[#D6B77A] border border-[#D6B77A]/30 px-2.5 py-0.5 rounded-full font-heading text-[10px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-[#D6B77A]" />
            100% Pure Sing-Tel
          </span>
          <span className="text-[#D6B77A]/40 hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5 text-[#FFF0DC]/90 text-[11px] sm:text-xs font-medium">
            <Truck className="w-3.5 h-3.5 text-[#D6B77A] shrink-0" />
            <span>
              Complimentary Doorstep Shipping on orders above{' '}
              <strong className="text-[#D6B77A] font-bold">₹{settings?.freeDeliveryThreshold || 999}</strong>
            </span>
          </div>
        </div>

        {/* Right Side: Morning Frying Batch & Language Switcher */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-[11px] text-[#D6B77A] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D6B77A] animate-pulse" />
            <span className="tracking-wide">Fresh Morning Batch: Fried in Rajkot</span>
          </div>

          <div className="flex items-center gap-1 border-l border-[#D6B77A]/20 pl-3">
            <Globe className="w-3.5 h-3.5 text-[#D6B77A]/70" />
            <button
              onClick={() => setLanguage('en')}
              className={`text-[10px] font-heading font-bold uppercase tracking-wider px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                language === 'en'
                  ? 'bg-[#D6B77A] text-[#50000D] font-extrabold shadow-xs'
                  : 'text-[#FFF0DC]/70 hover:text-[#FFF0DC]'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('gu')}
              className={`text-[10px] font-heading font-bold uppercase tracking-wider px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                language === 'gu'
                  ? 'bg-[#D6B77A] text-[#50000D] font-extrabold shadow-xs'
                  : 'text-[#FFF0DC]/70 hover:text-[#FFF0DC]'
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
