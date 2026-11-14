import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { Plus, Minus, HelpCircle, MessageCircle, ArrowRight, Sparkles } from 'lucide-react';
import { PRIMARY_WHATSAPP_NUMBER, buildWhatsAppLink } from '../config/whatsapp';

const FAQ = () => {
  const { settings } = useSettings();
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = settings.policies?.faq || [
    {
      question: 'Do you use pure groundnut oil (Sing-tel)?',
      answer:
        'Yes! 100% pure filtered groundnut oil (Sing-tel) is used exclusively for all our fried snacks, giving them the authentic, crisp Kathiyawadi aroma and taste without any greasy heaviness or palm oil blends.',
    },
    {
      question: 'How fresh are the snacks when shipped?',
      answer:
        'Our snacks are prepared in small artisanal lots using pure groundnut oil. Orders received are packed directly and sealed in airtight moisture-proof food-grade pouches before dispatch.',
    },
    {
      question: 'Can I select different weights for each snack?',
      answer:
        'Yes. Every snack is available in modular pack sizes: 250g, 500g, 1kg, and 2kg. You can also utilize our Custom Snack Combo Builder to mix and match multiple varieties into a single customized box.',
    },
    {
      question: 'Do you deliver outside Rajkot?',
      answer:
        'Yes, we ship across Gujarat and all major metro cities across India via expedited courier partners with tracking numbers provided upon dispatch.',
    },
    {
      question: 'What is the shelf life of your snacks?',
      answer:
        'Most of our fried snacks like Tikha Gathiya, Poha Chevdo, and Chakdi have a shelf life of 45 to 60 days when kept in an air-tight container in a cool, dry place away from direct sunlight.',
    },
    {
      question: 'Do you accept Cash on Delivery (COD)?',
      answer:
        'Yes, Cash on Delivery is supported for all verified residential and commercial delivery addresses across our service zones.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFF9F2] py-16 sm:py-24 text-[#21191A] font-sans selection:bg-[#790B13] selection:text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Editorial Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF0DC] border border-[#D6B77A]/40 text-[#790B13] text-xs font-mono uppercase tracking-widest shadow-xs">
            <HelpCircle className="w-3.5 h-3.5 text-[#D6B77A]" />
            <span>Curated Knowledge Base</span>
            <span className="text-[#D6B77A]">✦ Pure Taste</span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-5xl text-[#21191A] uppercase tracking-tight">
            Frequently Asked <span className="font-serif italic font-normal lowercase text-[#790B13]">questions</span>
          </h1>
          <p className="text-sm sm:text-base text-[#21191A]/70 font-sans leading-relaxed">
            Everything you need to know about our groundnut oil standard, daily small-batch frying, moisture-proof barrier pouches, and nationwide transit timelines.
          </p>
        </div>

        {/* Questions Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl transition-all border ${
                  isOpen
                    ? 'bg-white border-[#790B13]/40 shadow-md'
                    : 'bg-white/80 hover:bg-white border-[#D6B77A]/30'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left p-6 sm:p-7 cursor-pointer gap-4"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-full bg-[#FFF0DC] border border-[#D6B77A]/40 text-[#790B13] text-xs font-mono font-bold flex items-center justify-center shrink-0">
                      0{idx + 1}
                    </span>
                    <h3 className="font-heading font-black text-base sm:text-lg text-[#21191A] uppercase tracking-tight">
                      {faq.question}
                    </h3>
                  </div>
                  <span
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isOpen
                        ? 'bg-[#790B13] text-[#FFF0DC]'
                        : 'bg-[#FFF9F2] text-[#21191A] border border-[#D6B77A]/30'
                    }`}
                  >
                    {isOpen ? <Minus className="w-4 h-4 text-[#D6B77A]" /> : <Plus className="w-4 h-4" />}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-7 pb-7 pt-2 text-xs sm:text-sm text-[#21191A]/80 font-sans leading-relaxed border-t border-[#D6B77A]/20 ml-12">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Assistance Note */}
        <div className="bg-[#FFF0DC] p-8 sm:p-10 rounded-3xl border border-[#D6B77A]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm">
          <div>
            <div className="font-heading font-black text-lg text-[#21191A] uppercase tracking-tight">
              Have an unlisted culinary query?
            </div>
            <div className="text-xs sm:text-sm text-[#21191A]/70 font-sans mt-1">
              Reach out to our Rajkot workshop team directly on WhatsApp or telephone.
            </div>
          </div>
          <a
            href={buildWhatsAppLink(
              settings.whatsappNumber || PRIMARY_WHATSAPP_NUMBER,
              'Namaste Deepaji! I have a question regarding Gujarati Homemade Nasta.'
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#790B13] hover:bg-[#50000D] text-[#FFF0DC] px-8 py-4 rounded-full text-xs font-mono uppercase tracking-widest font-bold transition-all shadow-lg shadow-[#790B13]/20 active:scale-98 flex items-center gap-2 shrink-0 cursor-pointer group"
          >
            <MessageCircle className="w-4 h-4 text-[#D6B77A]" />
            <span>Chat on WhatsApp</span>
            <ArrowRight className="w-4 h-4 text-[#D6B77A] group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
