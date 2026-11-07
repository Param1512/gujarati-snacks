import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { Plus, Minus, HelpCircle, MessageCircle } from 'lucide-react';

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
        'We prepare batches daily in small artisanal lots. Orders received are packed directly from that morning’s freshly prepared batch and sealed in air-tight moisture-proof food-grade pouches before dispatch.',
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
    <div className="min-h-screen bg-[#FAF7F2] py-12 sm:py-16 text-[#000000]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#14382B] text-[#000000] text-xs font-bold shadow-xs">
            <HelpCircle className="w-3.5 h-3.5 text-[#C84B20]" />
            <span>Got questions? We have answers</span>
            <span className="font-script text-base text-[#C84B20]">Healthy snacks, happy you! ✦</span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-5xl text-[#000000] tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-sm sm:text-base text-[#555555] font-sans leading-relaxed">
            Everything you need to know about our groundnut oil standard, daily small-batch frying, moisture-proof packing, and express transit timelines.
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
                    ? 'bg-white border-[#000000]/40 shadow-sm'
                    : 'bg-white/60 hover:bg-white border-[#EAE3D9]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left p-5 sm:p-6 cursor-pointer gap-4"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-7 h-7 rounded-full bg-[#14382B] text-[#000000] text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <h3 className="font-heading font-bold text-base sm:text-lg text-[#000000]">
                      {faq.question}
                    </h3>
                  </div>
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isOpen
                        ? 'bg-[#000000] text-[#14382B]'
                        : 'bg-[#FAF7F2] text-[#000000] border border-[#EAE3D9]'
                    }`}
                  >
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-[#555555] font-sans leading-relaxed border-t border-[#EAE3D9] ml-11">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Assistance Note */}
        <div className="bg-[#EBF4EF] p-6 sm:p-8 rounded-3xl border border-[#14382B]/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div>
            <div className="font-heading font-bold text-base text-[#000000]">
              Have an unlisted query?
            </div>
            <div className="text-xs sm:text-sm text-[#555555] font-sans mt-0.5">
              Reach out to our Rajkot workshop team directly on WhatsApp or phone.
            </div>
          </div>
          <a
            href={`https://wa.me/${settings.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#C84B20] hover:bg-[#A33A16] text-white px-6 py-3 rounded-full text-xs sm:text-sm font-semibold transition-all shadow-md shadow-[#C84B20]/25 active:scale-98 flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp →</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
