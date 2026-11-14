import React from 'react';
import { useSettings } from '../../context/SettingsContext';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
  const { settings } = useSettings();

  const whatsappUrl = `https://wa.me/${settings.whatsappNumber || '919825012345'}?text=${encodeURIComponent(
    'Namaste! I would like to inquire about ordering fresh Gujarati homemade snacks.'
  )}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-[#50000D] to-[#790B13] hover:from-[#790B13] hover:to-[#50000D] text-[#FFF0DC] rounded-full py-3 px-4 sm:px-5 shadow-2xl flex items-center gap-2.5 group transition-all font-heading text-xs font-extrabold border border-[#D6B77A]/50 transform hover:scale-105 active:scale-95"
      title="Chat on WhatsApp"
    >
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
      </span>
      <MessageCircle className="w-4 h-4 text-[#D6B77A] group-hover:scale-110 transition-transform" />
      <span className="hidden sm:inline">Chat on WhatsApp</span>
    </a>
  );
};

export default WhatsAppButton;
