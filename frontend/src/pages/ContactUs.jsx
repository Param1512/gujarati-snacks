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
  const [subject, setSubject] = useState('Snack Commission');
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
    <div className="min-h-screen bg-[#FFF9F2] py-12 sm:py-20 text-[#21191A] font-sans selection:bg-[#790B13] selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Editorial Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF0DC] border border-[#D6B77A]/40 text-[#790B13] text-xs font-mono uppercase tracking-widest shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#D6B77A]" />
            <span>Kitchen Customer Helpline</span>
            <span className="text-[#D6B77A]">✦ Rajkot Dispatch</span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-5xl text-[#21191A] tracking-tight uppercase">
            Contact Rajkot <span className="font-serif italic font-normal lowercase text-[#790B13]">kitchen</span>
          </h1>
          <p className="text-sm sm:text-base text-[#21191A]/70 font-sans leading-relaxed">
            Inquiries regarding ingredients, custom spice adjustments, wedding commissions, or express doorstep dispatch to your pincode. We are honoured to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Information Card */}
          <div className="lg:col-span-5 bg-[#3A000A] text-[#FFF0DC] p-8 sm:p-10 rounded-3xl shadow-2xl space-y-8 border border-[#D6B77A]/30">
            <div>
              <span className="inline-block text-xs font-mono uppercase tracking-widest text-[#D6B77A] font-bold mb-2">
                Heritage Workshop & Atelier
              </span>
              <h2 className="font-heading font-black text-2xl sm:text-3xl text-[#FFF0DC] tracking-tight uppercase">
                {settings.storeName}
              </h2>
              <p className="text-xs sm:text-sm text-[#FFF0DC]/70 mt-1 font-sans">
                Authentic Homemade Gujarati Namkeen & Farsan
              </p>
            </div>

            <div className="space-y-6 text-xs sm:text-sm divide-y divide-[#D6B77A]/15 pt-2">
              <div className="pt-4 first:pt-0 flex items-start gap-4">
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-[#D6B77A]/30">
                  <MapPin className="w-4 h-4 text-[#D6B77A]" />
                </div>
                <div className="leading-relaxed">
                  <span className="block text-[11px] font-mono uppercase tracking-wider text-[#D6B77A] font-bold mb-1">Culinary Workshop</span>
                  <span className="text-[#FFF0DC]/80">
                    {settings.address?.shopNo}, {settings.address?.street},<br />
                    {settings.address?.area}, {settings.address?.city}, {settings.address?.state} - {settings.address?.pincode}
                  </span>
                </div>
              </div>

              <div className="pt-4 flex items-start gap-4">
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-[#D6B77A]/30">
                  <Phone className="w-4 h-4 text-[#D6B77A]" />
                </div>
                <div>
                  <span className="block text-[11px] font-mono uppercase tracking-wider text-[#D6B77A] font-bold mb-1">Direct Telephone</span>
                  <a href={`tel:${settings.phone}`} className="hover:text-[#D6B77A] font-mono font-bold text-[#FFF0DC] transition-colors">
                    {settings.phone}
                  </a>
                </div>
              </div>

              <div className="pt-4 flex items-start gap-4">
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-[#D6B77A]/30">
                  <Mail className="w-4 h-4 text-[#D6B77A]" />
                </div>
                <div>
                  <span className="block text-[11px] font-mono uppercase tracking-wider text-[#D6B77A] font-bold mb-1">Electronic Dispatch</span>
                  <a href={`mailto:${settings.email}`} className="hover:text-[#D6B77A] text-[#FFF0DC] transition-colors">
                    {settings.email}
                  </a>
                </div>
              </div>

              <div className="pt-4 flex items-start gap-4">
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-[#D6B77A]/30">
                  <Clock className="w-4 h-4 text-[#D6B77A]" />
                </div>
                <div>
                  <span className="block text-[11px] font-mono uppercase tracking-wider text-[#D6B77A] font-bold mb-1">Frying & Counter Schedule</span>
                  <span className="text-[#FFF0DC]/80">Monday through Sunday: 08:00 – 21:00 IST</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#D6B77A]/20">
              <a
                href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
                  'Namaste! I would like to inquire about your homemade Gujarati snacks.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#790B13] hover:bg-[#50000D] text-[#FFF0DC] py-4 px-6 rounded-full font-mono uppercase tracking-widest font-bold text-xs flex items-center justify-between transition-all shadow-lg shadow-[#790B13]/30 active:scale-98 cursor-pointer border border-[#D6B77A]/40 group"
              >
                <span className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-[#D6B77A]" />
                  Direct WhatsApp Inquiry
                </span>
                <ArrowRight className="w-4 h-4 text-[#D6B77A] group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

          {/* Message Form Card */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-12 rounded-3xl border border-[#D6B77A]/30 shadow-xl space-y-6">
            <div className="space-y-2 border-b border-[#D6B77A]/20 pb-4">
              <span className="font-mono text-xs uppercase tracking-widest text-[#790B13] font-bold">Inquiry Submission</span>
              <h2 className="font-heading font-black text-2xl uppercase tracking-tight text-[#21191A]">
                Dispatch a Message
              </h2>
              <p className="text-xs sm:text-sm text-[#21191A]/70 font-sans">
                Leave your specifications below. An artisan coordinator will respond within 4 working hours.
              </p>
            </div>

            {sent ? (
              <div className="p-8 sm:p-12 text-center bg-[#FFF0DC] rounded-2xl border border-[#D6B77A]/40 space-y-4">
                <CheckCircle2 className="w-14 h-14 text-[#790B13] mx-auto" />
                <h3 className="font-heading font-black text-xl text-[#21191A] uppercase tracking-tight">
                  Message Dispatched with Honour!
                </h3>
                <p className="text-xs sm:text-sm text-[#21191A]/70 font-sans max-w-sm mx-auto leading-relaxed">
                  Thank you for reaching out. Our family kitchen representative will reply promptly via telephone or email.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setSent(false)}
                    className="bg-[#21191A] hover:bg-[#790B13] text-[#FFF0DC] text-xs font-mono uppercase tracking-wider px-8 py-3.5 rounded-full transition-colors cursor-pointer"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 font-sans">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Anandbhai Patel"
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
                      placeholder="+91 98250 12345"
                      className="w-full bg-[#FFF9F2] border border-[#D6B77A]/30 rounded-xl px-4 py-3.5 text-xs sm:text-sm text-[#21191A] focus:outline-none focus:border-[#790B13] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="patel@example.com"
                    className="w-full bg-[#FFF9F2] border border-[#D6B77A]/30 rounded-xl px-4 py-3.5 text-xs sm:text-sm text-[#21191A] focus:outline-none focus:border-[#790B13] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-2">
                    Subject / Occasion
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-[#FFF9F2] border border-[#D6B77A]/30 rounded-xl px-4 py-3.5 text-xs sm:text-sm text-[#21191A] focus:outline-none focus:border-[#790B13] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-2">
                    Your Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we assist you with our homemade snacks, special batch requests, or delivery schedules?"
                    className="w-full bg-[#FFF9F2] border border-[#D6B77A]/30 rounded-xl p-4 text-xs sm:text-sm text-[#21191A] focus:outline-none focus:border-[#790B13] transition-colors"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-[#790B13] hover:bg-[#50000D] text-[#FFF0DC] px-10 py-4 rounded-full font-mono uppercase tracking-widest font-bold text-xs inline-flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg shadow-[#790B13]/25 active:scale-98 group"
                  >
                    <span>Submit Inquiry</span>
                    <ArrowRight className="w-4 h-4 text-[#D6B77A] group-hover:translate-x-1 transition-transform" />
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
