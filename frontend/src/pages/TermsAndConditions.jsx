import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { FileText } from 'lucide-react';

const TermsAndConditions = () => {
  const { settings } = useSettings();

  return (
    <div className="min-h-screen bg-[#FFF9F2] py-16 sm:py-24 text-[#21191A] font-sans selection:bg-[#790B13] selection:text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Editorial Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF0DC] border border-[#D6B77A]/40 text-[#790B13] text-xs font-mono uppercase tracking-widest shadow-xs">
            <FileText className="w-3.5 h-3.5 text-[#D6B77A]" />
            <span>Patron Charter & Terms</span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-5xl text-[#21191A] uppercase tracking-tight">
            Terms & <span className="font-serif italic font-normal lowercase text-[#790B13]">conditions</span>
          </h1>
          <p className="text-xs font-mono uppercase tracking-widest text-[#21191A]/60">
            Effective Date: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} • {settings.storeName}
          </p>
        </div>

        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#D6B77A]/30 shadow-xl text-xs sm:text-sm text-[#21191A] font-sans leading-relaxed space-y-8">
          <div className="bg-[#FFF0DC] p-6 rounded-2xl border border-[#D6B77A]/40 text-[#790B13] font-medium leading-relaxed font-sans">
            {settings.policies?.termsAndConditions ||
              'All snack items are freshly prepared in small batches under artisanal conditions. Orders are dispatched within 24-48 hours. By placing an order, you agree to inspect the parcel upon delivery.'}
          </div>

          <div className="space-y-3">
            <h2 className="font-heading font-black text-base sm:text-lg text-[#21191A] uppercase tracking-tight">
              1. Business Scope & Exclusive Delicacies
            </h2>
            <p className="text-[#21191A]/70">
              This digital boutique exclusively offers homemade Gujarati farsan and namkeen. All items are weighed accurately and sealed in food-grade barrier pouches in our Rajkot kitchen.
            </p>
          </div>

          <div className="border-t border-[#D6B77A]/20 pt-6 space-y-3">
            <h2 className="font-heading font-black text-base sm:text-lg text-[#21191A] uppercase tracking-tight">
              2. Dynamic Weight Pricing Structure
            </h2>
            <p className="text-[#21191A]/70">
              Snack prices are determined on a per-kilogram rate and computed dynamically according to chosen package weights (250g, 500g, 1kg, 2kg). The backend price calculation is final and verified on order placement.
            </p>
          </div>

          <div className="border-t border-[#D6B77A]/20 pt-6 space-y-3">
            <h2 className="font-heading font-black text-base sm:text-lg text-[#21191A] uppercase tracking-tight">
              3. Order Confirmation and Cancellation Protocol
            </h2>
            <p className="text-[#21191A]/70">
              Patrons may cancel their order freely prior to packaging and dispatch from the kitchen. Once a parcel is handed to the logistics courier, cancellation is not possible due to food safety and freshness protocols.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
