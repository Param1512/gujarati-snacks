/**
 * WhatsApp Order Message Formatting Service
 * Generates verified, itemized order summaries for WhatsApp confirmation.
 * Primary Recipient: Deepa Bhansali (+91 9426845625)
 */

function formatWhatsAppOrder(order, settings = {}) {
  const storeName = settings.storeName || 'Gujarati Homemade Nasta & Snacks';
  const recipientName = settings.whatsappRecipientName || 'Deepa Bhansali';
  let recipientPhone = (settings.whatsappNumber || '919426845625').toString().replace(/\D/g, '');
  if (recipientPhone.length === 10) {
    recipientPhone = `91${recipientPhone}`;
  }

  const customerName = order.shippingAddress?.fullName || order.guestCustomer?.name || 'Customer';
  const customerPhone = order.shippingAddress?.phone || order.guestCustomer?.phone || '';

  // Address assembly
  const addrParts = [];
  if (order.shippingAddress?.addressLine1) addrParts.push(order.shippingAddress.addressLine1);
  if (order.shippingAddress?.area) addrParts.push(order.shippingAddress.area);
  if (order.shippingAddress?.addressLine2) addrParts.push(order.shippingAddress.addressLine2);
  if (order.shippingAddress?.landmark) {
    const lm = order.shippingAddress.landmark.trim();
    addrParts.push(lm.toLowerCase().startsWith('near') ? lm : `Near ${lm}`);
  }
  const cityState = `${order.shippingAddress?.city || 'Rajkot'}, ${order.shippingAddress?.state || 'Gujarat'} - ${order.shippingAddress?.pincode || ''}`;
  addrParts.push(cityState);
  const fullAddress = addrParts.join(', ');

  // Itemized snack list
  const itemsList = (order.orderItems || [])
    .map((item, index) => {
      const weight = item.weightLabel || `${item.weightGrams}g`;
      return `${index + 1}. *${item.name}* (${weight})\n   Qty: ${item.quantity} × ₹${item.calculatedUnitPrice} = *₹${item.itemSubtotal}*`;
    })
    .join('\n');

  // Payment status badge
  let paymentText = '';
  if (order.paymentMethod === 'razorpay') {
    const isPaid = order.paymentStatus === 'paid';
    const ref = order.paymentDetails?.razorpayPaymentId ? `\n• *Payment Ref:* ${order.paymentDetails.razorpayPaymentId}` : '';
    paymentText = `• *Method:* Online Payment (Razorpay)\n• *Status:* ${isPaid ? '✅ PAID (Verified)' : '⏳ PENDING PAYMENT'}${ref}`;
  } else {
    paymentText = `• *Method:* Cash on Delivery (COD)\n• *Status:* ⏳ Pending Collection Upon Delivery`;
  }

  // Delivery fee label
  const deliveryFeeLabel = order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`;

  // Coupon discount line
  const discountLine = order.discountAmount > 0 
    ? `\n• *Discount:* -₹${order.discountAmount}${order.appliedCoupon?.code ? ` (${order.appliedCoupon.code})` : ''}` 
    : '';

  // Delivery instructions
  const instructions = order.shippingAddress?.deliveryInstructions || order.customerNotes || '';
  const instructionsLine = instructions ? `\n• *Delivery Note:* ${instructions}` : '';

  // Build clean, professional WhatsApp text
  const message = [
    `🛍️ *NEW NASTA ORDER: ${order.orderNumber}*`,
    `🏪 *${storeName}*`,
    `----------------------------------------`,
    `👤 *CUSTOMER DETAILS:*`,
    `• *Name:* ${customerName}`,
    `• *Mobile:* ${customerPhone}`,
    `• *Delivery Address:* ${fullAddress}${instructionsLine}`,
    `----------------------------------------`,
    `📦 *ORDERED SNACKS:*`,
    itemsList,
    `----------------------------------------`,
    `💰 *BILLING SUMMARY:*`,
    `• *Items Subtotal:* ₹${order.itemsSubtotal}`,
    `• *Delivery Charge:* ${deliveryFeeLabel}${discountLine}`,
    `• *GRAND TOTAL:* *₹${order.totalAmount}*`,
    `----------------------------------------`,
    `💳 *PAYMENT DETAILS:*`,
    paymentText,
    `----------------------------------------`,
    `🙏 *Deepaji, please confirm my homemade nasta order!*`,
  ].join('\n');

  const waUrl = `https://wa.me/${recipientPhone}?text=${encodeURIComponent(message)}`;

  return {
    recipientName,
    recipientPhone,
    formattedMessage: message,
    waUrl,
  };
}

module.exports = {
  formatWhatsAppOrder,
};
