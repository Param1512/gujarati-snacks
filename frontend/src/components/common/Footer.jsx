import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import { useLanguage } from '../../context/LanguageContext';
import { ArrowUpRight, Sparkles, Heart, ShieldCheck, Phone, MapPin, Mail } from 'lucide-react';

const Footer = () => {
  const { settings } = useSettings();
  const { language } = useLanguage();

  return (
    <footer className="bg-[#3A000A] text-[#FFF0DC] border-t border-[#D6B77A]/30 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        
        {/* Top Brand Statement & Grand Editorial Title */}
        <div className="pb-14 border-b border-[#D6B77A]/20 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#D6B77A]" />
              <span className="font-heading text-xs font-bold uppercase tracking-widest text-[#D6B77A]">
                શુદ્ધ શીંગતેલ • શુદ્ધ કાઠિયાવાડી સ્વાદ • Rajkot Heritage
              </span>
            </div>
            <h2 className="font-editorial text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#FFF0DC]">
              {language === 'gu' && settings.storeNameGujarati
                ? settings.storeNameGujarati
                : (settings.storeName || 'Gujarati Nasta & Snacks')}
              <span className="text-[#D6B77A]">.</span>
            </h2>
            <p className="font-heading text-sm uppercase tracking-widest text-[#D6B77A] mt-2">
              Authentic Kathiyawadi Homemade Snacks & Farsan
            </p>
          </div>
          
          <div className="max-w-md text-xs sm:text-sm text-[#FFF0DC]/80 font-sans leading-relaxed">
            Prepared fresh daily in 100% pure filtered groundnut oil (Sing-Tel) in Rajkot. No palm oil, zero chemical preservatives, zero compromises. Generational recipes delivered fresh to your doorstep.
          </div>
        </div>

        {/* Navigation & Contact Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 py-14 border-b border-[#D6B77A]/20 text-xs font-heading">
          {/* Column 1: Shop */}
          <div className="space-y-3.5">
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#D6B77A]">Snack Collection</p>
            <ul className="space-y-2.5 text-[#FFF0DC]/80 font-medium">
              <li>
                <Link to="/snacks" className="hover:text-[#D6B77A] transition-colors">
                  All Snacks & Namkeen
                </Link>
              </li>
              <li>
                <Link to="/snacks?search=Gathiya" className="hover:text-[#D6B77A] transition-colors">
                  Tikha Gathiya (₹500/kg)
                </Link>
              </li>
              <li>
                <Link to="/snacks?search=Chevdo" className="hover:text-[#D6B77A] transition-colors">
                  Plain Poha Chevdo (₹400/kg)
                </Link>
              </li>
              <li>
                <Link to="/snacks?search=Chakdi" className="hover:text-[#D6B77A] transition-colors">
                  Chakdi / Chakli (₹500/kg)
                </Link>
              </li>
              <li>
                <Link to="/combo-builder" className="hover:text-[#D6B77A] transition-colors flex items-center gap-1 text-[#D6B77A] font-bold">
                  <span>Custom Snack Box</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Inquiries & Services */}
          <div className="space-y-3.5">
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#D6B77A]">Services & Orders</p>
            <ul className="space-y-2.5 text-[#FFF0DC]/80 font-medium">
              <li>
                <Link to="/bulk-orders" className="hover:text-[#D6B77A] transition-colors">
                  Bulk & Event Catering
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="hover:text-[#D6B77A] transition-colors">
                  Order Tracking
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-[#D6B77A] transition-colors">
                  Snack Categories
                </Link>
              </li>
              <li>
                <a
                  href={`https://wa.me/${settings.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#D6B77A] transition-colors flex items-center gap-1 text-[#D6B77A] font-bold"
                >
                  <span>Chat on WhatsApp</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#D6B77A]" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Heritage & FAQ */}
          <div className="space-y-3.5">
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#D6B77A]">Kitchen & Quality</p>
            <ul className="space-y-2.5 text-[#FFF0DC]/80 font-medium">
              <li>
                <Link to="/about-us" className="hover:text-[#D6B77A] transition-colors">
                  The Sing-Tel Tradition
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-[#D6B77A] transition-colors">
                  Ingredients & Oil Purity FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact-us" className="hover:text-[#D6B77A] transition-colors">
                  Rajkot Kitchen Location
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Kitchen Info */}
          <div className="space-y-3.5">
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#D6B77A]">Direct Contact</p>
            <div className="space-y-2 text-[#FFF0DC]/80 text-[11px] leading-relaxed">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#D6B77A] shrink-0 mt-0.5" />
                <span>{settings.storeAddress || '150 Feet Ring Road, Rajkot, Gujarat - 360005'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#D6B77A] shrink-0" />
                <span>{settings.storePhone || '+91 98250 12345'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#D6B77A] shrink-0" />
                <span>{settings.storeEmail || 'orders@gujaratinasta.com'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Guarantee Badges */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FFF0DC]/60 font-sans">
          <p>© {new Date().getFullYear()} Gujarati Homemade Nasta & Snacks. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-[#D6B77A]">100% Pure Filtered Groundnut Oil</span>
            <span>•</span>
            <span>Zero Preservatives</span>
            <span>•</span>
            <span className="text-[#FFF0DC] font-medium flex items-center gap-1">
              Made with <Heart className="w-3 h-3 fill-[#C98789] text-[#C98789]" /> in Rajkot
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
