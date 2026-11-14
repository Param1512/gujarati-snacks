import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  ArrowUpRight,
  Sparkles,
  Heart,
  ShieldCheck,
  Phone,
  MapPin,
  Mail,
  Send,
  Check,
  Truck,
  Flame,
} from 'lucide-react';

const Footer = () => {
  const { settings } = useSettings();
  const { language } = useLanguage();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setNewsletterEmail('');
      }, 3000);
    }
  };

  return (
    <footer className="relative bg-gradient-to-b from-[#240006] via-[#1a0004] to-[#120003] text-[#FFF0DC] border-t border-[#D6B77A]/30 font-sans overflow-hidden">
      
      {/* Background Watermark Typography */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 select-none pointer-events-none opacity-[0.03] text-[9rem] sm:text-[14rem] font-heading font-black tracking-tighter whitespace-nowrap text-[#FFF0DC]">
        GUJARATI NASTA
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        
        {/* VIP Newsletter Strip */}
        <div className="bg-[#FFF0DC]/5 backdrop-blur-xl border border-[#D6B77A]/25 rounded-3xl p-6 sm:p-10 mb-14 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 space-y-2 text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-heading font-extrabold uppercase tracking-widest text-[#D6B77A]">
                <Sparkles className="w-3 h-3 text-[#D6B77A]" /> Kitchen Club Privileges
              </span>
              <h3 className="font-heading font-black text-2xl sm:text-3xl text-[#FFF0DC] tracking-tight">
                Get ₹50 Off Your First Order
              </h3>
              <p className="text-xs sm:text-sm text-[#FFF0DC]/75 font-sans">
                Subscribe for private festive hamper announcements, seasonal batch alerts, and secret discount codes.
              </p>
            </div>

            <div className="lg:col-span-5">
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  required
                  className="bg-white/10 border border-[#D6B77A]/35 rounded-full px-5 py-3 text-xs text-[#FFF0DC] placeholder-[#FFF0DC]/50 focus:outline-none focus:border-[#D6B77A] flex-1 font-sans"
                />
                <button
                  type="submit"
                  className="bg-[#D6B77A] hover:bg-[#E9D8C3] text-[#50000D] font-heading font-extrabold text-xs uppercase tracking-wider px-6 py-3 rounded-full shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                >
                  {subscribed ? (
                    <>
                      <Check className="w-4 h-4 text-[#50000D]" />
                      <span>Code: NASTA50</span>
                    </>
                  ) : (
                    <>
                      <span>Join Club</span>
                      <Send className="w-3.5 h-3.5 text-[#50000D]" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Brand Statement & Grand Editorial Title */}
        <div className="pb-12 border-b border-[#D6B77A]/20 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-[#50000D] border border-[#D6B77A]/40 flex items-center justify-center font-gujarati text-sm font-bold text-[#D6B77A]">
                ગુ
              </div>
              <span className="font-heading text-xs font-bold uppercase tracking-widest text-[#D6B77A]">
                શુદ્ધ શીંગતેલ • કાઠિયાવાડી સ્વાદ • Rajkot Kitchen
              </span>
            </div>
            <h2 className="font-editorial text-4xl sm:text-5xl font-bold tracking-tight text-[#FFF0DC]">
              {language === 'gu' && settings.storeNameGujarati
                ? settings.storeNameGujarati
                : (settings.storeName || 'Gujarati Nasta & Snacks')}
              <span className="text-[#D6B77A]">.</span>
            </h2>
            <p className="font-heading text-xs sm:text-sm uppercase tracking-widest text-[#D6B77A] mt-2">
              Authentic Kathiyawadi Homemade Snacks & Farsan
            </p>
          </div>
          
          <div className="max-w-md text-xs sm:text-sm text-[#FFF0DC]/80 font-sans leading-relaxed">
            Prepared fresh in 100% pure filtered groundnut oil (Sing-Tel) in Rajkot. No palm oil, zero chemical preservatives, zero compromises. Generational recipes delivered in pristine airtight packs straight to your doorstep across India.
          </div>
        </div>

        {/* Navigation & Contact Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-b border-[#D6B77A]/20 text-xs font-heading">
          {/* Column 1: Shop */}
          <div className="space-y-3">
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#D6B77A]">Snack Collection</p>
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
          <div className="space-y-3">
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#D6B77A]">Services & Orders</p>
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
                  href={`https://wa.me/${settings.whatsappNumber || '919825012345'}`}
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
          <div className="space-y-3">
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#D6B77A]">Kitchen & Quality</p>
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
              <li>
                <Link to="/shipping-refund-policy" className="hover:text-[#D6B77A] transition-colors">
                  Shipping & Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Kitchen Info */}
          <div className="space-y-3">
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#D6B77A]">Direct Kitchen Helpline</p>
            <div className="space-y-2.5 text-[#FFF0DC]/80 text-[11px] leading-relaxed font-sans">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#D6B77A] shrink-0 mt-0.5" />
                <span>Shop 4, Shreeji Complex, 150 Feet Ring Road, Rajkot, Gujarat - 360005</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#D6B77A] shrink-0" />
                <span>{settings.phone || '+91 98250 12345'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#D6B77A] shrink-0" />
                <span>{settings.email || 'orders@gujaratinasta.com'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Seals & Accepted Payments */}
        <div className="py-8 flex flex-wrap items-center justify-between gap-4 border-b border-[#D6B77A]/15 text-[11px] font-heading uppercase tracking-wider text-[#FFF0DC]/70">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5 text-[#D6B77A]">
              <ShieldCheck className="w-4 h-4 text-[#D6B77A]" /> 100% Saurashtra Sing-Tel
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-[#D6B77A]" /> Free Shipping Over ₹{settings.freeDeliveryThreshold || 999}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-[#D6B77A]" /> Zero Palm Oil Guarantee
            </span>
          </div>

          <div className="flex items-center gap-2 text-[10px] bg-white/5 px-3 py-1.5 rounded-full border border-[#D6B77A]/20">
            <span>Accepted Payments:</span>
            <strong className="text-[#D6B77A]">UPI • Cards • NetBanking • Cash on Delivery</strong>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#FFF0DC]/60 font-sans">
          <p>© {new Date().getFullYear()} Gujarati Homemade Nasta & Snacks. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <Link to="/privacy-policy" className="hover:underline">Privacy Policy</Link>
            <span>•</span>
            <Link to="/terms-and-conditions" className="hover:underline">Terms & Conditions</Link>
            <span>•</span>
            <span className="text-[#FFF0DC] font-medium flex items-center gap-1">
              Handcrafted with <Heart className="w-3 h-3 fill-[#C98789] text-[#C98789]" /> in Rajkot
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
