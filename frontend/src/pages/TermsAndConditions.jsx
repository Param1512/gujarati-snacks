import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { FileText } from 'lucide-react';

const TermsAndConditions = () => {
  const { settings } = useSettings();

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-12 sm:py-16 text-[#000000]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#14382B] text-[#000000] text-xs font-bold shadow-xs">
            <FileText className="w-3.5 h-3.5 text-[#C84B20]" />
            <span>Customer Agreement</span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-5xl text-[#000000] tracking-tight">
            Terms & Conditions
          </h1>
          <p className="text-xs sm:text-sm text-[#555555] font-sans">
            Effective Date: {new Date().toLocaleDateString()} • {settings.storeName}
          </p>
        </div>

        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#EAE3D9] shadow-sm text-xs sm:text-sm text-[#000000] font-sans leading-relaxed space-y-6">
          <div className="bg-[#EBF4EF] p-5 rounded-2xl border border-[#14382B]/60 text-[#000000] font-medium leading-relaxed">
            {settings.policies?.termsAndConditions ||
              'All snack items are freshly prepared in hygienic conditions. Orders are dispatched within 24-48 hours. By placing an order, you agree to inspect the parcel upon delivery.'}
          </div>

          <div className="space-y-2">
            <h2 className="font-heading font-bold text-base sm:text-lg text-[#000000]">
              1. Business Products & Scope
            </h2>
            <p className="text-[#555555]">
              This website exclusively sells homemade Gujarati farsan and namkeen. All items are weighed accurately and packed in food-grade pouches in our Rajkot kitchen.
            </p>
          </div>

          <div className="border-t border-[#EAE3D9] pt-6 space-y-2">
            <h2 className="font-heading font-bold text-base sm:text-lg text-[#000000]">
              2. Dynamic Weight Pricing
            </h2>
            <p className="text-[#555555]">
              Snack prices are determined on a per-kilogram basis and computed dynamically according to the chosen package weight (250g, 500g, 1kg, 2kg). The backend price calculation is final and binding.
            </p>
          </div>

          <div className="border-t border-[#EAE3D9] pt-6 space-y-2">
            <h2 className="font-heading font-bold text-base sm:text-lg text-[#000000]">
              3. Order Confirmation and Cancellation
            </h2>
            <p className="text-[#555555]">
              Customers may cancel their order freely before the kitchen packs and dispatches the parcel. Once an order is handed over to the delivery executive or courier partner, cancellation is not possible due to food safety and freshness protocols.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
