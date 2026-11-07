import React from 'react';
import { useSettings } from '../../context/SettingsContext';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
  const { settings } = useSettings();

  const whatsappUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
    'Namaste! I would like to inquire about ordering fresh Gujarati homemade snacks.'
  )}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 bg-[#14382B] hover:bg-[#0D261C] text-white rounded-full py-3 px-4 shadow-gourmet-lg flex items-center gap-2 group transition-all font-heading text-xs font-bold border border-[#F7C04A]/40 transform hover:scale-105"
      title="Chat on WhatsApp"
    >
      <MessageCircle className="w-4 h-4 text-[#F7C04A]" />
      <span className="hidden sm:inline">WhatsApp Concierge</span>
    </a>
  );
};

export default WhatsAppButton;
