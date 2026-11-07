import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { ShieldCheck } from 'lucide-react';

const PrivacyPolicy = () => {
  const { settings } = useSettings();

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-12 sm:py-16 text-[#000000]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#14382B] text-[#000000] text-xs font-bold shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C84B20]" />
            <span>Legal & Data Protection</span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-5xl text-[#000000] tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-[#555555] font-sans">
            Effective Date: {new Date().toLocaleDateString()} • {settings.storeName}
          </p>
        </div>

        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#EAE3D9] shadow-sm text-xs sm:text-sm text-[#000000] font-sans leading-relaxed space-y-6">
          <div className="bg-[#EBF4EF] p-5 rounded-2xl border border-[#14382B]/60 text-[#000000] font-medium leading-relaxed">
            {settings.policies?.privacyPolicy ||
              'We respect your privacy. All customer data collected during checkout is strictly used to fulfill snack orders and deliver fresh homemade savouries to your doorstep. We never sell or share your personal contact details.'}
          </div>

          <div className="space-y-2">
            <h2 className="font-heading font-bold text-base sm:text-lg text-[#000000]">
              1. Information We Collect
            </h2>
            <p className="text-[#555555]">
              When you order snacks or register an account, we collect your name, delivery address, phone number, and email. For online payments, payment transactions are handled securely through 256-bit encrypted Razorpay gateways; we do not store your credit card or UPI MPIN numbers on our servers.
            </p>
          </div>

          <div className="border-t border-[#EAE3D9] pt-6 space-y-2">
            <h2 className="font-heading font-bold text-base sm:text-lg text-[#000000]">
              2. How We Use Your Data
            </h2>
            <p className="text-[#555555]">
              Your contact information is exclusively used to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-[#555555]">
              <li>Fulfill, pack, and ship your ordered snack packs accurately.</li>
              <li>Send WhatsApp / SMS status updates regarding dispatch and local Rajkot delivery.</li>
              <li>Provide customer support and resolve order queries promptly.</li>
            </ul>
          </div>

          <div className="border-t border-[#EAE3D9] pt-6 space-y-2">
            <h2 className="font-heading font-bold text-base sm:text-lg text-[#000000]">
              3. Security Protocols
            </h2>
            <p className="text-[#555555]">
              We use industry-standard HTTPS encryption, password hashing with bcrypt, and secure HTTP-only cookies to ensure your account credentials and browsing sessions remain safe at all times.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
