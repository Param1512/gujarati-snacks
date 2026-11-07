import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import { useLanguage } from '../../context/LanguageContext';
import { ArrowUpRight, Sparkles, Heart } from 'lucide-react';

const Footer = () => {
  const { settings } = useSettings();
  const { language } = useLanguage();

  return (
    <footer className="bg-[#0F291E] text-white border-t border-[#1D4E3C] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        
        {/* Top Brand Statement */}
        <div className="pb-12 border-b border-white/10 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#F7C04A]" />
              <span className="font-heading text-xs font-bold uppercase tracking-widest text-[#F7C04A]">
                શુદ્ધ શીંગતેલ • શુદ્ધ કાઠિયાવાડી સ્વાદ • Rajkot, Gujarat
              </span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
              {language === 'gu' && settings.storeNameGujarati
                ? settings.storeNameGujarati
                : 'Giriraj'}
              <span className="text-[#C84B20]">.</span>
            </h2>
            <div className="font-script text-xl sm:text-2xl text-white/80 mt-1">
              Handcrafted Kathiyawadi Farsan & Namkeen
            </div>
          </div>
          
          <div className="max-w-md text-xs sm:text-sm text-white/75 font-sans leading-relaxed">
            Prepared fresh daily in 100% pure filtered groundnut oil (Sing-Tel) in Rajkot. No palm oil, zero chemical preservatives, zero compromises. Generational recipes delivered across India.
          </div>
        </div>

        {/* Navigation & Info Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 py-12 border-b border-white/10 text-xs font-heading">
          {/* Column 1: Shop */}
          <div className="space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#F7C04A]">Shop Nasta</p>
            <ul className="space-y-2.5 text-white/80 font-medium">
              <li>
                <Link to="/snacks" className="hover:text-[#F7C04A] transition-colors">
                  All Snacks & Namkeen
                </Link>
              </li>
              <li>
                <Link to="/snacks?search=Gathiya" className="hover:text-[#F7C04A] transition-colors">
                  Tikha Gathiya (₹500/kg)
                </Link>
              </li>
              <li>
                <Link to="/snacks?search=Chevdo" className="hover:text-[#F7C04A] transition-colors">
                  Plain Poha Chevdo (₹400/kg)
                </Link>
              </li>
              <li>
                <Link to="/snacks?search=Chakdi" className="hover:text-[#F7C04A] transition-colors">
                  Chakdi / Chakli (₹500/kg)
                </Link>
              </li>
              <li>
                <Link to="/combo-builder" className="hover:text-[#F7C04A] transition-colors flex items-center gap-1 text-[#F7C04A] font-bold">
                  <span>Custom Snack Dabba</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Service & Inquiries */}
          <div className="space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#F7C04A]">Services</p>
            <ul className="space-y-2.5 text-white/80 font-medium">
              <li>
                <Link to="/bulk-orders" className="hover:text-[#F7C04A] transition-colors">
                  Bulk & NRI Event Catering
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="hover:text-[#F7C04A] transition-colors">
                  Order Tracking
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-[#F7C04A] transition-colors">
                  Snack Categories
                </Link>
              </li>
              <li>
                <a
                  href={`https://wa.me/${settings.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#F7C04A] transition-colors flex items-center gap-1 text-[#EBF4EF] font-bold"
                >
                  <span>WhatsApp Concierge</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#F7C04A]" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Brand & Story */}
          <div className="space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#F7C04A]">Heritage</p>
            <ul className="space-y-2.5 text-white/80 font-medium">
              <li>
                <Link to="/about-us" className="hover:text-[#F7C04A] transition-colors">
                  The Sing-Tel Tradition
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-[#F7C04A] transition-colors">
                  Ingredients & Oil Purity FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact-us" className="hover:text-[#F7C04A] transition-colors">
                  Rajkot Kitchen Location
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Policies & Safety */}
          <div className="space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#F7C04A]">Trust & Guarantee</p>
            <ul className="space-y-2.5 text-white/80 font-medium">
              <li>
                <Link to="/shipping-policy" className="hover:text-[#F7C04A] transition-colors">
                  Aroma-Lock Fresh Shipping
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-[#F7C04A] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-[#F7C04A] transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Verification */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60 font-sans">
          <p>© {new Date().getFullYear()} Giriraj Homemade Snacks. All rights reserved. Rajkot, Gujarat, India.</p>
          <div className="flex items-center gap-4 text-white/50 text-xs">
            <span>100% Filtered Groundnut Oil</span>
            <span>•</span>
            <span>Zero Preservatives</span>
            <span>•</span>
            <span className="text-[#F7C04A] font-medium flex items-center gap-1">
              Made with <Heart className="w-3 h-3 fill-[#C84B20] text-[#C84B20]" /> in Saurashtra
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
