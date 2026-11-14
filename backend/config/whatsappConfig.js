/**
 * Centralized WhatsApp Configuration
 * Allows toggling between Testing Phase number and Permanent Business number.
 */

const WHATSAPP_CONFIG = {
  // Testing Contact (Deepa Bhansali)
  testingPhone: '919316152114',
  
  // Permanent Business Contact (Deepa Bhansali)
  permanentPhone: '919426845625',

  // Active configuration (reads from environment variables or defaults to testing)
  recipientName: process.env.WHATSAPP_RECIPIENT_NAME || 'Deepa Bhansali',
  activePhone: process.env.WHATSAPP_ORDER_PHONE || '919316152114',
};

module.exports = WHATSAPP_CONFIG;
