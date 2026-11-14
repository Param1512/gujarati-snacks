const Order = require('../models/Order');
const Payment = require('../models/Payment');
const BusinessSettings = require('../models/BusinessSettings');
const { verifyPaymentSignature, verifyWebhookSignature } = require('../services/razorpayService');
const { formatWhatsAppOrder } = require('../services/whatsappService');

// @desc Verify Razorpay payment signature
// @route POST /api/payments/verify
exports.verifyPayment = async (req, res, next) => {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    if (!orderId || !razorpayOrderId || !razorpayPaymentId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required payment verification details',
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Duplicate callback check
    if (order.paymentStatus === 'paid') {
      return res.status(200).json({
        success: true,
        message: 'Order has already been verified and marked as paid',
        order,
      });
    }

    // Verify signature
    const isValid = verifyPaymentSignature({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });

    if (!isValid) {
      await Payment.findOneAndUpdate(
        { order: order._id },
        {
          status: 'failed',
          razorpayPaymentId,
          errorDetails: { message: 'Signature verification mismatch' },
        }
      );

      order.paymentStatus = 'failed';
      await order.save();

      return res.status(400).json({
        success: false,
        message: 'Payment verification failed: Signature does not match.',
      });
    }

    // Update Order & Payment
    order.paymentStatus = 'paid';
    order.orderStatus = 'confirmed';
    order.paymentDetails = {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      paidAt: new Date(),
    };
    order.trackingHistory.push({
      status: 'confirmed',
      title: 'Payment Verified & Order Confirmed',
      description: `Payment of ₹${order.totalAmount} received successfully via Razorpay (Txn ID: ${razorpayPaymentId}).`,
      updatedAt: new Date(),
    });

    const settings = (await BusinessSettings.findOne()) || {};
    const waDetails = formatWhatsAppOrder(order, settings);
    order.whatsappNotification = {
      recipientName: waDetails.recipientName,
      recipientPhone: waDetails.recipientPhone,
      formattedMessage: waDetails.formattedMessage,
      waUrl: waDetails.waUrl,
    };
    await order.save();

    await Payment.findOneAndUpdate(
      { order: order._id },
      {
        status: 'captured',
        razorpayPaymentId,
        razorpaySignature,
      },
      { upsert: true }
    );

    res.status(200).json({
      success: true,
      message: 'Payment successfully verified and order confirmed!',
      order,
      whatsappUrl: waDetails.waUrl,
      whatsappMessage: waDetails.formattedMessage,
      whatsappRecipient: {
        name: waDetails.recipientName,
        phone: waDetails.recipientPhone,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Razorpay Webhook Handler
// @route POST /api/payments/webhook
exports.handleWebhook = async (req, res, next) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const rawBody = JSON.stringify(req.body);

    if (process.env.RAZORPAY_WEBHOOK_SECRET) {
      const isValid = verifyWebhookSignature(rawBody, signature);
      if (!isValid) {
        return res.status(400).json({ success: false, message: 'Invalid webhook signature' });
      }
    }

    const event = req.body.event;
    const payload = req.body.payload;

    if (event === 'payment.captured') {
      const paymentEntity = payload.payment.entity;
      const rzpOrderId = paymentEntity.order_id;

      const order = await Order.findOne({ 'paymentDetails.razorpayOrderId': rzpOrderId });
      if (order && order.paymentStatus !== 'paid') {
        order.paymentStatus = 'paid';
        order.orderStatus = 'confirmed';
        order.paymentDetails.razorpayPaymentId = paymentEntity.id;
        order.paymentDetails.paidAt = new Date();
        await order.save();
      }
    }

    res.status(200).json({ status: 'ok' });
  } catch (error) {
    next(error);
  }
};

