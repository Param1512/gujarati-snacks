/**
 * Centralized WhatsApp Ordering & Contact Configuration
 *
 * Current Phase: TESTING PHASE
 * Contact Person: Deepa Bhansali
 * Testing Number: 9316152114 (Destination: https://wa.me/919316152114)
 * Permanent Number: 9426845625 (Destination: https://wa.me/919426845625)
 *
 * Note: To revert back to the permanent number after testing, simply toggle IS_TESTING_PHASE to false.
 */

export const IS_TESTING_PHASE = true;

export const RECIPIENT_DISPLAY_NAME = 'Deepa Bhansali';

// Testing WhatsApp destination (+91 9316152114)
export const TESTING_WHATSAPP_NUMBER = '919316152114';
export const TESTING_PHONE_DISPLAY = '+91 93161 52114';

// Permanent Business WhatsApp destination (+91 9426845625)
export const PERMANENT_WHATSAPP_NUMBER = '919426845625';
export const PERMANENT_PHONE_DISPLAY = '+91 94268 45625';

// Active primary order contact
export const PRIMARY_WHATSAPP_NUMBER = IS_TESTING_PHASE
  ? TESTING_WHATSAPP_NUMBER
  : PERMANENT_WHATSAPP_NUMBER;

export const PRIMARY_PHONE_DISPLAY = IS_TESTING_PHASE
  ? TESTING_PHONE_DISPLAY
  : PERMANENT_PHONE_DISPLAY;

/**
 * Builds a valid, safely URL-encoded wa.me destination link.
 * @param {string} phone - Target phone number (defaults to PRIMARY_WHATSAPP_NUMBER)
 * @param {string} message - Unencoded message string
 * @returns {string} Fully encoded https://wa.me/91... URL
 */
export function buildWhatsAppLink(phone = PRIMARY_WHATSAPP_NUMBER, message = '') {
  let cleanPhone = (phone || PRIMARY_WHATSAPP_NUMBER).toString().replace(/\D/g, '');
  if (cleanPhone.length === 10) {
    cleanPhone = `91${cleanPhone}`;
  }
  return message
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
    : `https://wa.me/${cleanPhone}`;
}
