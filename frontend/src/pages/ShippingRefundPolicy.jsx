import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { Truck } from 'lucide-react';

const ShippingRefundPolicy = () => {
  const { settings } = useSettings();

  return (
    <div className="min-h-screen bg-[#FFF9F2] py-16 sm:py-24 text-[#21191A] font-sans selection:bg-[#790B13] selection:text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Editorial Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF0DC] border border-[#D6B77A]/40 text-[#790B13] text-xs font-mono uppercase tracking-widest shadow-xs">
            <Truck className="w-3.5 h-3.5 text-[#D6B77A]" />
            <span>Transit & Assurance Policy</span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-5xl text-[#21191A] uppercase tracking-tight">
            Shipping & <span className="font-serif italic font-normal lowercase text-[#790B13]">refunds</span>
          </h1>
          <p className="text-xs font-mono uppercase tracking-widest text-[#21191A]/60">
            {settings.storeName} • Rajkot, Gujarat
          </p>
        </div>

        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#D6B77A]/30 shadow-xl text-xs sm:text-sm text-[#21191A] font-sans leading-relaxed space-y-8">
          <div className="bg-[#FFF0DC] p-6 rounded-2xl border border-[#D6B77A]/40 text-[#790B13] font-medium leading-relaxed font-sans">
            {settings.policies?.shippingAndRefund ||
              'Local deliveries in Rajkot are dispatched within 4-8 hours or next morning. Gujarat and Interstate shipments arrive within 2-4 business days. Because snacks are perishable homemade food products, returns are accepted only in case of package tampering or transit damage reported within 24 hours of delivery.'}
          </div>

          <div className="space-y-3">
            <h2 className="font-heading font-black text-base sm:text-lg text-[#21191A] uppercase tracking-tight">
              1. Rajkot Local Express Dispatch
            </h2>
            <p className="text-[#21191A]/70">
              Orders placed within Rajkot city limits are dispatched directly from our local kitchen on 150 Feet Ring Road. Deliveries are typically completed within 4 to 8 hours or early next morning. Standard delivery charge is ₹{settings.deliveryCharges?.localRajkot || 30}, and complimentary on orders above ₹{settings.freeDeliveryThreshold || 999}.
            </p>
          </div>

          <div className="border-t border-[#D6B77A]/20 pt-6 space-y-3">
            <h2 className="font-heading font-black text-base sm:text-lg text-[#21191A] uppercase tracking-tight">
              2. Gujarat & Nationwide Courier
            </h2>
            <p className="text-[#21191A]/70">
              For other cities across Gujarat and India, snack parcels are sealed in multi-layer barrier pouches, packed in corrugated shipping cartons, and shipped via expedited air/surface couriers. Delivery timelines range from 2 to 4 business days.
            </p>
          </div>

          <div className="border-t border-[#D6B77A]/20 pt-6 space-y-3">
            <h2 className="font-heading font-black text-base sm:text-lg text-[#21191A] uppercase tracking-tight">
              3. Fresh Food Return & Replacement Guarantee
            </h2>
            <p className="text-[#21191A]/70">
              Because our snacks are freshly made food products prepared without chemical preservatives, we cannot accept returns once an individual packet has been opened. If you receive a damaged carton or compromised seal, please capture photographs and notify our WhatsApp support team ({settings.phone}) within 24 hours of delivery. We will immediately dispatch a fresh replacement or process a refund.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingRefundPolicy;
