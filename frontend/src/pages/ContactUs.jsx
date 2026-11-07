import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

const ContactUs = () => {
  const { settings } = useSettings();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Snack Enquiry');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-12 sm:py-16 text-[#000000]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#14382B] text-[#000000] text-xs font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#C84B20]" />
            <span>Direct Inquiries & Kitchen Counter</span>
            <span className="font-script text-base text-[#C84B20]">Always Fresh ✨</span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-5xl text-[#000000] tracking-tight">
            Contact Rajkot Kitchen
          </h1>
          <p className="text-sm sm:text-base text-[#555555] font-sans leading-relaxed">
            Have questions about ingredients, custom spice balances, wedding parcels, or doorstep dispatch to your pincode? We are always here to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Information Card */}
          <div className="lg:col-span-5 bg-[#000000] text-white p-8 sm:p-10 rounded-3xl shadow-xl space-y-8">
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#D89B2B] mb-2">
                Workshop & Dispatch Desk
              </span>
              <h2 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight">
                {settings.storeName}
              </h2>
              <p className="text-xs sm:text-sm text-white/80 mt-1 font-sans">
                Authentic Homemade Gujarati Namkeen & Farsan
              </p>
            </div>

            <div className="space-y-5 text-xs sm:text-sm divide-y divide-white/10 pt-2">
              <div className="pt-4 first:pt-0 flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-[#D89B2B]" />
                </div>
                <div className="leading-relaxed">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-[#D89B2B] mb-0.5">Physical Kitchen</span>
                  {settings.address?.shopNo}, {settings.address?.street},<br />
                  {settings.address?.area}, {settings.address?.city}, {settings.address?.state} - {settings.address?.pincode}
                </div>
              </div>

              <div className="pt-4 flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-[#D89B2B]" />
                </div>
                <div>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-[#D89B2B] mb-0.5">Kitchen Helpline</span>
                  <a href={`tel:${settings.phone}`} className="hover:text-[#D89B2B] font-bold text-white transition-colors">
                    {settings.phone}
                  </a>
                </div>
              </div>

              <div className="pt-4 flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-[#D89B2B]" />
                </div>
                <div>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-[#D89B2B] mb-0.5">Direct Email</span>
                  <a href={`mailto:${settings.email}`} className="hover:text-[#D89B2B] text-white transition-colors">
                    {settings.email}
                  </a>
                </div>
              </div>

              <div className="pt-4 flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-[#D89B2B]" />
                </div>
                <div>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-[#D89B2B] mb-0.5">Frying & Counter Hours</span>
                  <span>Monday to Sunday: 08:00 – 21:00 IST</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <a
                href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
                  'Namaste! I would like to inquire about your homemade Gujarati snacks.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#C84B20] hover:bg-[#A33A16] text-white py-3.5 px-6 rounded-full font-bold text-xs sm:text-sm flex items-center justify-between transition-all shadow-md shadow-[#C84B20]/25 active:scale-98 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-white" />
                  Direct WhatsApp Inquiry
                </span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Message Form Card */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-[#EAE3D9] shadow-sm space-y-6">
            <div className="space-y-1">
              <span className="font-script text-xl text-[#C84B20]">Drop us a note ⤵</span>
              <h2 className="font-heading font-black text-2xl text-[#000000]">
                Send a Message
              </h2>
              <p className="text-xs sm:text-sm text-[#555555] font-sans">
                Leave your details below. A kitchen coordinator will respond within 4 working hours.
              </p>
            </div>

            {sent ? (
              <div className="p-8 sm:p-10 text-center bg-[#EBF4EF] rounded-2xl border border-[#14382B]/60 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#000000] mx-auto" />
                <h3 className="font-heading font-bold text-lg text-[#000000]">
                  Message Dispatched Successfully!
                </h3>
                <p className="text-xs sm:text-sm text-[#555555] font-sans max-w-sm mx-auto">
                  Thank you for reaching out. Our family kitchen representative will reply shortly via phone or email.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setSent(false)}
                    className="bg-[#000000] text-white text-xs font-semibold px-6 py-2.5 rounded-full hover:bg-[#1a1a1a] transition-colors cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 font-sans">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#555555] mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Anandbhai Patel"
                      className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#000000] focus:outline-none focus:border-[#000000] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#555555] mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98250 12345"
                      className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#000000] focus:outline-none focus:border-[#000000] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#555555] mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="patel@example.com"
                    className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#000000] focus:outline-none focus:border-[#000000] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#555555] mb-1.5">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#000000] focus:outline-none focus:border-[#000000] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#555555] mb-1.5">
                    Your Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we assist you with our homemade snacks, special batch requests, or delivery schedules?"
                    className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-2xl p-4 text-xs sm:text-sm text-[#000000] focus:outline-none focus:border-[#000000] transition-colors"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-[#C84B20] hover:bg-[#A33A16] text-white px-8 py-3.5 rounded-full font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md shadow-[#C84B20]/25 active:scale-98"
                  >
                    <span>Submit Inquiry</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
