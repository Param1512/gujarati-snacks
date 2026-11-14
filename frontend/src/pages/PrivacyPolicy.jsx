import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { ShieldCheck } from 'lucide-react';

const PrivacyPolicy = () => {
  const { settings } = useSettings();

  return (
    <div className="min-h-screen bg-[#FFF9F2] py-16 sm:py-24 text-[#21191A] font-sans selection:bg-[#790B13] selection:text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Editorial Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF0DC] border border-[#D6B77A]/40 text-[#790B13] text-xs font-mono uppercase tracking-widest shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D6B77A]" />
            <span>Legal & Patron Data Protection</span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-5xl text-[#21191A] uppercase tracking-tight">
            Privacy <span className="font-serif italic font-normal lowercase text-[#790B13]">charter</span>
          </h1>
          <p className="text-xs font-mono uppercase tracking-widest text-[#21191A]/60">
            Effective Date: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} • {settings.storeName}
          </p>
        </div>

        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#D6B77A]/30 shadow-xl text-xs sm:text-sm text-[#21191A] font-sans leading-relaxed space-y-8">
          <div className="bg-[#FFF0DC] p-6 rounded-2xl border border-[#D6B77A]/40 text-[#790B13] font-medium leading-relaxed font-sans">
            {settings.policies?.privacyPolicy ||
              'We respect your privacy. All patron data collected during checkout is strictly used to fulfill snack orders and deliver fresh homemade savouries to your doorstep. We never sell or share your personal contact details.'}
          </div>

          <div className="space-y-3">
            <h2 className="font-heading font-black text-base sm:text-lg text-[#21191A] uppercase tracking-tight">
              1. Information We Collect
            </h2>
            <p className="text-[#21191A]/70">
              When you commission snacks or register a patron account, we collect your name, delivery address, phone number, and email. For digital payments, transactions are processed securely through 256-bit encrypted Razorpay gateways; we never store your card numbers or UPI MPIN credentials on our servers.
            </p>
          </div>

          <div className="border-t border-[#D6B77A]/20 pt-6 space-y-3">
            <h2 className="font-heading font-black text-base sm:text-lg text-[#21191A] uppercase tracking-tight">
              2. Purpose of Data Utilization
            </h2>
            <p className="text-[#21191A]/70">
              Your contact information is strictly utilized to:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-[#21191A]/70 font-sans">
              <li>Accurately prepare, pack, and dispatch your ordered snack packages.</li>
              <li>Provide WhatsApp and SMS notifications regarding kitchen frying status and courier dispatch.</li>
              <li>Deliver personal customer concierge support for inquiries or special dietary requests.</li>
            </ul>
          </div>

          <div className="border-t border-[#D6B77A]/20 pt-6 space-y-3">
            <h2 className="font-heading font-black text-base sm:text-lg text-[#21191A] uppercase tracking-tight">
              3. Security Architecture
            </h2>
            <p className="text-[#21191A]/70">
              We employ strict HTTPS encryption, cryptographic bcrypt hashing for account passwords, and secure HTTP-only cookies to ensure your authentication tokens and browsing sessions remain protected at all times.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
