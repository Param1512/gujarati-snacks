import React, { useState } from 'react';
import api from '../services/api';
import { useSettings } from '../context/SettingsContext';
import { Check, MessageCircle, Package } from 'lucide-react';

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
    <div className="min-h-screen bg-[#FAF7F2] py-10 sm:py-16 text-[#000000]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#14382B] text-[#000000] text-xs font-bold shadow-xs">
            <Package className="w-3.5 h-3.5 text-[#000000]" />
            <span>Catering & Corporate Gifting</span>
            <span className="font-script text-base text-[#C84B20]">Fresh batch guaranteed ✨</span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-5xl text-[#000000] tracking-tight">
            Bulk Orders & Event Catering
          </h1>
          <p className="text-sm sm:text-base text-[#555555] font-sans leading-relaxed">
            Directly from our Rajkot master kitchen. Freshly prepared in pure groundnut oil with authentic Kathiyawadi recipes for weddings, festivals, corporate gifting, and community gatherings.
          </p>
        </div>

        {submitted ? (
          <div className="bg-[#EBF4EF] p-10 sm:p-14 rounded-3xl border border-[#14382B]/60 text-center space-y-5 shadow-sm">
            <div className="w-16 h-16 bg-[#000000] text-[#14382B] rounded-full flex items-center justify-center mx-auto shadow-md">
              <Check className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="font-heading font-bold text-2xl text-[#000000]">
                Bulk Enquiry Received!
              </h2>
              <p className="text-sm text-[#555555] max-w-md mx-auto font-sans leading-relaxed">
                Thank you, <strong className="text-[#000000]">{name}</strong>. Our kitchen manager will review your required quantities and call you at <strong className="text-[#000000]">{phone}</strong> within 4 hours with special wholesale pricing.
              </p>
            </div>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setSubmitted(false)}
                className="w-full sm:w-auto bg-[#000000] hover:bg-[#1a1a1a] text-white text-xs font-semibold px-8 py-3.5 rounded-full transition-colors shadow-sm cursor-pointer"
              >
                Submit Another Inquiry
              </button>
              <a
                href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
                  `Namaste! I just submitted bulk enquiry for ${name} (${approximateQuantityKg} kg).`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-white border border-[#EAE3D9] hover:border-[#000000] text-[#000000] text-xs font-semibold px-6 py-3.5 rounded-full transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-[#000000]" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-10 rounded-3xl border border-[#EAE3D9] shadow-sm space-y-8 font-sans">
            {errorMessage && (
              <div className="p-4 bg-rose-50 text-rose-800 border border-rose-200 rounded-2xl text-xs font-semibold">
                {errorMessage}
              </div>
            )}

            {/* Contact Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-[#EAE3D9] pb-2">
                <span className="w-6 h-6 rounded-full bg-[#000000] text-[#14382B] text-xs font-bold flex items-center justify-center">1</span>
                <h3 className="font-heading font-bold text-base text-[#000000]">Contact Information</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#555555] mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ketanbhai Joshi"
                    className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#000000] focus:outline-none focus:border-[#000000] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#555555] mb-1.5">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 98250 12345"
                    className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#000000] focus:outline-none focus:border-[#000000] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#555555] mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#000000] focus:outline-none focus:border-[#000000] transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Event Specs */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-[#EAE3D9] pb-2">
                <span className="w-6 h-6 rounded-full bg-[#000000] text-[#14382B] text-xs font-bold flex items-center justify-center">2</span>
                <h3 className="font-heading font-bold text-base text-[#000000]">Event & Volume Details</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#555555] mb-1.5">
                    Event Type
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#000000] focus:outline-none focus:border-[#000000] transition-colors"
                  >
                    <option value="Family Function">Family Gathering</option>
                    <option value="Wedding / Engagement">Wedding / Reception</option>
                    <option value="Corporate Gifting">Corporate Hampers</option>
                    <option value="Festival / Community">Festival / Community</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#555555] mb-1.5">
                    Expected Guests
                  </label>
                  <input
                    type="number"
                    min="10"
                    value={approximateGuests}
                    onChange={(e) => setApproximateGuests(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#000000] focus:outline-none focus:border-[#000000] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#555555] mb-1.5">
                    Approx. Quantity (KG) *
                  </label>
                  <input
                    type="number"
                    min="5"
                    required
                    value={approximateQuantityKg}
                    onChange={(e) => setApproximateQuantityKg(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#000000] focus:outline-none focus:border-[#000000] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#555555] mb-1.5">
                    Delivery Date
                  </label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#000000] focus:outline-none focus:border-[#000000] transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Preferred Snacks Selection */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#EAE3D9] pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#000000] text-[#14382B] text-xs font-bold flex items-center justify-center">3</span>
                  <h3 className="font-heading font-bold text-base text-[#000000]">Preferred Snack Varieties</h3>
                </div>
                <span className="font-script text-sm text-[#C84B20]">Pick all that apply ⤵</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {snackCheckboxes.map((snk) => {
                  const isChecked = preferredSnacks.includes(snk);
                  return (
                    <button
                      type="button"
                      key={snk}
                      onClick={() => handleToggleSnack(snk)}
                      className={`px-3 py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer border text-center ${
                        isChecked
                          ? 'bg-[#C84B20] text-white border-[#C84B20] shadow-sm font-bold'
                          : 'bg-[#FAF7F2] text-[#555555] border-[#EAE3D9] hover:border-[#C84B20] hover:text-[#000000]'
                      }`}
                    >
                      {snk}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Location & Instructions */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-[#EAE3D9] pb-2">
                <span className="w-6 h-6 rounded-full bg-[#000000] text-[#14382B] text-xs font-bold flex items-center justify-center">4</span>
                <h3 className="font-heading font-bold text-base text-[#000000]">Delivery Details & Notes</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#555555] mb-1.5">
                    Delivery Venue / Hall Address
                  </label>
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Full street address or hall venue"
                    className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#000000] focus:outline-none focus:border-[#000000] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#555555] mb-1.5">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#000000] focus:outline-none focus:border-[#000000] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#555555] mb-1.5">
                  Special Instructions or Packaging Preferences
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="E.g., custom 250g individual pouch packaging for return gifts, mild spice level..."
                  className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-2xl p-4 text-xs sm:text-sm text-[#000000] focus:outline-none focus:border-[#000000] transition-colors"
                />
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto bg-[#C84B20] hover:bg-[#A33A16] text-white text-xs sm:text-sm font-semibold px-8 py-3.5 rounded-full transition-all cursor-pointer disabled:opacity-50 shadow-md shadow-[#C84B20]/25 hover:shadow-lg active:scale-98 flex items-center justify-center gap-2"
              >
                <span>{submitting ? 'Submitting Enquiry...' : 'Submit Bulk Enquiry →'}</span>
              </button>

              <a
                href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
                  'Namaste! I would like to enquire about a bulk snack order for our upcoming event.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto border border-[#EAE3D9] hover:border-[#000000] bg-white text-[#000000] text-xs sm:text-sm font-semibold px-6 py-3.5 rounded-full transition-colors flex items-center justify-center gap-2 shadow-sm hover:bg-[#FAF7F2] cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-[#000000]" />
                <span>Direct WhatsApp Inquiry</span>
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default BulkOrders;
