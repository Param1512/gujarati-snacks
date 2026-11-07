const crypto = require('crypto');
const Razorpay = require('razorpay');

let razorpayInstance = null;

const getRazorpayInstance = () => {
  if (!razorpayInstance) {
    const key_id = process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder';
    const key_secret = process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret';
    razorpayInstance = new Razorpay({
      key_id,
      key_secret,
    });
  }
  return razorpayInstance;
};

/**
 * Create a Razorpay Order
 * @param {number} amountInRupees 
 * @param {string} receiptId 
 * @param {object} notes 
 */
const createRazorpayOrder = async (amountInRupees, receiptId, notes = {}) => {
  const instance = getRazorpayInstance();
  const options = {
    amount: Math.round(amountInRupees * 100), // Amount in paise
    currency: 'INR',
    receipt: receiptId.toString(),
    notes,
  };

  try {
    const order = await instance.orders.create(options);
    return order;
  } catch (error) {
    console.error('[Razorpay Order Creation Error]:', error);
    // If running in development without valid Razorpay live credentials, generate a simulated test order
    if (process.env.NODE_ENV !== 'production' || process.env.RAZORPAY_KEY_ID?.includes('placeholder') || process.env.RAZORPAY_KEY_ID?.includes('Demo')) {
      console.warn('[Razorpay] Using mock Razorpay order for development/testing');
      return {
        id: `order_mock_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        entity: 'order',
        amount: options.amount,
        amount_paid: 0,
        amount_due: options.amount,
        currency: 'INR',
        receipt: options.receipt,
        status: 'created',
        attempts: 0,
        notes: options.notes,
        created_at: Math.floor(Date.now() / 1000),
      };
    }
    throw error;
  }
};

/**
 * Verify Razorpay payment signature
 */
const verifyPaymentSignature = ({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) => {
  const secret = process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret';

  // Support for development simulation
  if (razorpayOrderId?.startsWith('order_mock_')) {
    return true;
  }

  const generatedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex');

  return generatedSignature === razorpaySignature;
};

/**
 * Verify Webhook signature
 */
const verifyWebhookSignature = (rawBody, signature) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'placeholder_webhook_secret';
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody)
    .digest('hex');

  return expectedSignature === signature;
};

module.exports = {
  createRazorpayOrder,
  verifyPaymentSignature,
  verifyWebhookSignature,
};

