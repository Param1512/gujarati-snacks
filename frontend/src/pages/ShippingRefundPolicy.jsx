import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { Truck } from 'lucide-react';

const ShippingRefundPolicy = () => {
  const { settings } = useSettings();

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-12 sm:py-16 text-[#000000]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#14382B] text-[#000000] text-xs font-bold shadow-xs">
            <Truck className="w-3.5 h-3.5 text-[#C84B20]" />
            <span>Delivery & Returns Policy</span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-5xl text-[#000000] tracking-tight">
            Shipping & Refund Policy
          </h1>
          <p className="text-xs sm:text-sm text-[#555555] font-sans">
            {settings.storeName} • Rajkot, Gujarat
          </p>
        </div>

        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#EAE3D9] shadow-sm text-xs sm:text-sm text-[#000000] font-sans leading-relaxed space-y-6">
          <div className="bg-[#EBF4EF] p-5 rounded-2xl border border-[#14382B]/60 text-[#000000] font-medium leading-relaxed">
            {settings.policies?.shippingAndRefund ||
              'Local deliveries in Rajkot are dispatched within 4-8 hours or next morning. Gujarat and Interstate shipments arrive within 2-4 business days. Because snacks are perishable homemade food products, returns are accepted only in case of package tampering or transit damage reported within 24 hours of delivery.'}
          </div>

          <div className="space-y-2">
            <h2 className="font-heading font-bold text-base sm:text-lg text-[#000000]">
              1. Rajkot Local Fast Delivery
            </h2>
            <p className="text-[#555555]">
              Orders placed within Rajkot city limits are dispatched directly from our local kitchen on 150 Feet Ring Road. Deliveries are typically completed within 4 to 8 hours or early next morning. Standard delivery charge is ₹{settings.deliveryCharges?.localRajkot || 30}, and FREE on orders above ₹{settings.freeDeliveryThreshold || 999}.
            </p>
          </div>

          <div className="border-t border-[#EAE3D9] pt-6 space-y-2">
            <h2 className="font-heading font-bold text-base sm:text-lg text-[#000000]">
              2. Gujarat & Interstate Express Courier
            </h2>
            <p className="text-[#555555]">
              For other cities across Gujarat and India, snack parcels are vacuum-sealed, packed in sturdy corrugated cartons, and shipped via express courier. Delivery timelines range from 2 to 4 business days depending on distance and air connectivity.
            </p>
          </div>

          <div className="border-t border-[#EAE3D9] pt-6 space-y-2">
            <h2 className="font-heading font-bold text-base sm:text-lg text-[#000000]">
              3. Perishable Food Return & Refund Policy
            </h2>
            <p className="text-[#555555]">
              Because our snacks are perishable food products prepared without chemical preservatives, we do not accept returns once a packet has been opened. If you receive a damaged box or compromised seal, please capture photos and notify our WhatsApp support ({settings.phone}) within 24 hours of receipt. We will promptly dispatch a replacement batch or process a refund.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingRefundPolicy;
