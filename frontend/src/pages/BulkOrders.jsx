import React, { useState } from 'react';
import api from '../services/api';
import { useSettings } from '../context/SettingsContext';
import { Check, MessageCircle, Package, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import { PRIMARY_WHATSAPP_NUMBER, buildWhatsAppLink } from '../config/whatsapp';

const BulkOrders = () => {
  const { settings } = useSettings();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [eventType, setEventType] = useState('Family Function');
  const [approximateGuests, setApproximateGuests] = useState(50);
  const [preferredSnacks, setPreferredSnacks] = useState([]);
  const [approximateQuantityKg, setApproximateQuantityKg] = useState(10);
  const [eventDate, setEventDate] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [city, setCity] = useState('Rajkot');
  const [notes, setNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const snackCheckboxes = [
    'Tikha Gathiya',
    'Plain Poha Chevdo',
    'Chakdi',
    'Jhaal Mudi',
    'Masala Sing Daliya',
    'Nimkin',
    'Sev Mamra',
    'Sev',
    'Methi Chatpati',
    'Maida Farsi Puri',
  ];

  const handleToggleSnack = (snackName) => {
    setPreferredSnacks((prev) =>
      prev.includes(snackName) ? prev.filter((s) => s !== snackName) : [...prev, snackName]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSubmitting(true);

    try {
      const res = await api.post('/bulk-orders', {
        name,
        email,
        phone,
        eventType,
        approximateGuests: Number(approximateGuests),
        preferredSnacks,
        approximateQuantityKg: Number(approximateQuantityKg),
        eventDate,
        deliveryAddress,
        city,
        notes,
      });

      if (res.success) {
        setSubmitted(true);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to submit bulk order enquiry');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F2] py-12 sm:py-20 text-[#21191A] font-sans selection:bg-[#790B13] selection:text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Luxury Editorial Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF0DC] border border-[#D6B77A]/40 text-[#790B13] text-xs font-mono uppercase tracking-widest shadow-xs">
            <Package className="w-3.5 h-3.5 text-[#D6B77A]" />
            <span>Curated Commissions & Gifting</span>
            <span className="text-[#D6B77A]">✦ Fresh Small Batches</span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-[#21191A] tracking-tight uppercase leading-none">
            Bulk Orders & <span className="font-serif italic font-normal lowercase text-[#790B13]">celebration</span> Hampers
          </h1>
          <p className="text-sm sm:text-base text-[#21191A]/70 font-sans leading-relaxed">
            Directly from our heritage Rajkot kitchen. Prepared in cold-pressed pure groundnut oil with authentic Kathiyawadi secret recipes for royal weddings, corporate gifting, Diwali hampers, and family gatherings.
          </p>
        </div>

        {submitted ? (
          <div className="bg-[#FFF0DC] p-10 sm:p-14 rounded-3xl border border-[#D6B77A]/40 text-center space-y-6 shadow-sm">
            <div className="w-20 h-20 bg-[#790B13] text-[#D6B77A] rounded-full flex items-center justify-center mx-auto shadow-xl ring-8 ring-[#FFF0DC]">
              <Check className="w-10 h-10" />
            </div>
            <div className="space-y-3">
              <span className="font-mono text-xs uppercase tracking-widest text-[#790B13] font-bold">Commission Confirmed</span>
              <h2 className="font-heading font-black text-2xl sm:text-4xl text-[#21191A] uppercase tracking-tight">
                Enquiry Received with Honour
              </h2>
              <p className="text-sm sm:text-base text-[#21191A]/70 max-w-md mx-auto leading-relaxed">
                Thank you, <strong className="text-[#21191A]">{name}</strong>. Our master artisan will review your required volume and contact you at <strong className="text-[#790B13]">{phone}</strong> within 4 hours with bespoke tier pricing and sample options.
              </p>
            </div>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setSubmitted(false)}
                className="w-full sm:w-auto bg-[#21191A] hover:bg-[#790B13] text-[#FFF0DC] text-xs font-mono uppercase tracking-widest px-8 py-4 rounded-full transition-all shadow-md cursor-pointer"
              >
                Submit Another Inquiry
              </button>
              <a
                href={buildWhatsAppLink(
                  settings.whatsappNumber || PRIMARY_WHATSAPP_NUMBER,
                  `Namaste Deepaji! I just submitted a bulk enquiry for ${name} (${approximateQuantityKg} kg).`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-white border border-[#D6B77A]/40 hover:border-[#790B13] text-[#21191A] text-xs font-mono uppercase tracking-widest px-8 py-4 rounded-full transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-[#790B13]" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-12 rounded-3xl border border-[#D6B77A]/30 shadow-xl space-y-10">
            {errorMessage && (
              <div className="p-4 bg-rose-50 text-rose-800 border border-rose-200 rounded-2xl text-xs font-mono">
                {errorMessage}
              </div>
            )}

            {/* Step 1: Contact Details */}
            <div className="space-y-5">
              <div className="flex items-center gap-3 border-b border-[#D6B77A]/20 pb-3">
                <span className="w-7 h-7 rounded-full bg-[#790B13] text-[#D6B77A] text-xs font-mono font-bold flex items-center justify-center shadow-xs">01</span>
                <div>
                  <h3 className="font-heading font-black text-lg text-[#21191A] uppercase tracking-tight">Contact Information</h3>
                  <p className="text-xs text-[#21191A]/60">Your private details for the quotation</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ketanbhai Joshi"
                    className="w-full bg-[#FFF9F2] border border-[#D6B77A]/30 rounded-xl px-4 py-3.5 text-xs sm:text-sm text-[#21191A] focus:outline-none focus:border-[#790B13] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-2">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 98250 12345"
                    className="w-full bg-[#FFF9F2] border border-[#D6B77A]/30 rounded-xl px-4 py-3.5 text-xs sm:text-sm text-[#21191A] focus:outline-none focus:border-[#790B13] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-[#FFF9F2] border border-[#D6B77A]/30 rounded-xl px-4 py-3.5 text-xs sm:text-sm text-[#21191A] focus:outline-none focus:border-[#790B13] transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Event Specs */}
            <div className="space-y-5">
              <div className="flex items-center gap-3 border-b border-[#D6B77A]/20 pb-3">
                <span className="w-7 h-7 rounded-full bg-[#790B13] text-[#D6B77A] text-xs font-mono font-bold flex items-center justify-center shadow-xs">02</span>
                <div>
                  <h3 className="font-heading font-black text-lg text-[#21191A] uppercase tracking-tight">Event & Volume Specifications</h3>
                  <p className="text-xs text-[#21191A]/60">Scale and timeline considerations</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-2">
                    Event Type
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full bg-[#FFF9F2] border border-[#D6B77A]/30 rounded-xl px-4 py-3.5 text-xs sm:text-sm text-[#21191A] focus:outline-none focus:border-[#790B13] transition-colors cursor-pointer"
                  >
                    <option value="Family Function">Family Gathering</option>
                    <option value="Wedding / Engagement">Wedding / Reception</option>
                    <option value="Corporate Gifting">Corporate Hampers</option>
                    <option value="Festival / Community">Festival / Community</option>
                    <option value="Other">Other Occasion</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-2">
                    Expected Guests
                  </label>
                  <input
                    type="number"
                    min="10"
                    value={approximateGuests}
                    onChange={(e) => setApproximateGuests(e.target.value)}
                    className="w-full bg-[#FFF9F2] border border-[#D6B77A]/30 rounded-xl px-4 py-3.5 text-xs sm:text-sm text-[#21191A] focus:outline-none focus:border-[#790B13] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-2">
                    Approx. Volume (KG) *
                  </label>
                  <input
                    type="number"
                    min="5"
                    required
                    value={approximateQuantityKg}
                    onChange={(e) => setApproximateQuantityKg(e.target.value)}
                    className="w-full bg-[#FFF9F2] border border-[#D6B77A]/30 rounded-xl px-4 py-3.5 text-xs sm:text-sm text-[#21191A] focus:outline-none focus:border-[#790B13] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-2">
                    Required Delivery Date
                  </label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full bg-[#FFF9F2] border border-[#D6B77A]/30 rounded-xl px-4 py-3.5 text-xs sm:text-sm text-[#21191A] focus:outline-none focus:border-[#790B13] transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Preferred Varieties */}
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-[#D6B77A]/20 pb-3">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-[#790B13] text-[#D6B77A] text-xs font-mono font-bold flex items-center justify-center shadow-xs">03</span>
                  <div>
                    <h3 className="font-heading font-black text-lg text-[#21191A] uppercase tracking-tight">Preferred Snack Varieties</h3>
                    <p className="text-xs text-[#21191A]/60">Select all snacks you wish to include in your order</p>
                  </div>
                </div>
                <span className="font-mono text-xs uppercase tracking-widest text-[#790B13] font-bold">Select Multiple</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {snackCheckboxes.map((snk) => {
                  const isChecked = preferredSnacks.includes(snk);
                  return (
                    <button
                      type="button"
                      key={snk}
                      onClick={() => handleToggleSnack(snk)}
                      className={`px-3 py-3 rounded-xl text-xs font-medium transition-all cursor-pointer border text-center ${
                        isChecked
                          ? 'bg-[#790B13] text-[#FFF0DC] border-[#790B13] shadow-md font-bold'
                          : 'bg-[#FFF9F2] text-[#21191A]/80 border-[#D6B77A]/30 hover:border-[#790B13] hover:text-[#790B13]'
                      }`}
                    >
                      {snk}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Venue & Notes */}
            <div className="space-y-5">
              <div className="flex items-center gap-3 border-b border-[#D6B77A]/20 pb-3">
                <span className="w-7 h-7 rounded-full bg-[#790B13] text-[#D6B77A] text-xs font-mono font-bold flex items-center justify-center shadow-xs">04</span>
                <div>
                  <h3 className="font-heading font-black text-lg text-[#21191A] uppercase tracking-tight">Venue Details & Custom Requests</h3>
                  <p className="text-xs text-[#21191A]/60">Logistics and packaging requirements</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-2">
                    Delivery Address / Hall Venue
                  </label>
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Full street address, hall name, or banquet venue"
                    className="w-full bg-[#FFF9F2] border border-[#D6B77A]/30 rounded-xl px-4 py-3.5 text-xs sm:text-sm text-[#21191A] focus:outline-none focus:border-[#790B13] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#FFF9F2] border border-[#D6B77A]/30 rounded-xl px-4 py-3.5 text-xs sm:text-sm text-[#21191A] focus:outline-none focus:border-[#790B13] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-2">
                  Custom Packaging, Labeling, or Spice Notes
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="E.g., custom 250g individual pouch packaging for return gifts with personalized wedding seals, mild spice blend..."
                  className="w-full bg-[#FFF9F2] border border-[#D6B77A]/30 rounded-xl p-4 text-xs sm:text-sm text-[#21191A] focus:outline-none focus:border-[#790B13] transition-colors"
                />
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto bg-[#790B13] hover:bg-[#50000D] text-[#FFF0DC] text-xs font-mono uppercase tracking-widest px-10 py-4 rounded-full transition-all cursor-pointer disabled:opacity-50 shadow-lg shadow-[#790B13]/20 hover:shadow-xl active:scale-98 flex items-center justify-center gap-2 group"
              >
                <span>{submitting ? 'Transmitting Commission...' : 'Submit Wholesale Commission'}</span>
                <ArrowRight className="w-4 h-4 text-[#D6B77A] group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href={buildWhatsAppLink(
                  settings.whatsappNumber || PRIMARY_WHATSAPP_NUMBER,
                  'Namaste Deepaji! I would like to enquire about a bulk snack order for our upcoming event.'
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto border border-[#D6B77A]/40 hover:border-[#790B13] bg-white text-[#21191A] text-xs font-mono uppercase tracking-widest px-8 py-4 rounded-full transition-colors flex items-center justify-center gap-2 shadow-sm hover:bg-[#FFF0DC]/40 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-[#790B13]" />
                <span>WhatsApp Our Kitchen</span>
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default BulkOrders;
