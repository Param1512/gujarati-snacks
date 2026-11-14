const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    pricePerKg: {
      type: Number,
      required: true,
    },
    weightGrams: {
      type: Number,
      required: true,
    },
    weightLabel: {
      type: String,
      required: true,
    },
    calculatedUnitPrice: {
      type: Number,
      required: true, // (pricePerKg * weightGrams) / 1000
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    totalGrams: {
      type: Number,
      required: true, // weightGrams * quantity
    },
    itemSubtotal: {
      type: Number,
      required: true, // calculatedUnitPrice * quantity
    },
    imageUrl: {
      type: String,
      default: '',
    },
    isCombo: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true }
);

const trackingStepSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
      enum: [
        'pending',
        'confirmed',
        'preparing',
        'packed',
        'dispatched',
        'delivered',
        'cancelled',
      ],
    },
    title: String,
    description: String,
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
      default: null,
    },
    isGuest: {
      type: Boolean,
      default: true,
    },
    guestCustomer: {
      name: { type: String, default: '' },
      phone: { type: String, default: '' },
      email: { type: String, default: '' },
    },
    orderItems: {
      type: [orderItemSchema],
      required: true,
      validate: [(val) => val.length > 0, 'An order must contain at least one item'],
    },
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, default: '' },
      addressLine1: { type: String, required: true },
      addressLine2: { type: String, default: '' },
      area: { type: String, default: '' },
      landmark: { type: String, default: '' },
      city: { type: String, required: true, default: 'Rajkot' },
      state: { type: String, required: true, default: 'Gujarat' },
      pincode: { type: String, required: true },
      deliveryInstructions: { type: String, default: '' },
    },
    deliveryType: {
      type: String,
      enum: ['local_rajkot', 'customer_pickup', 'standard_shipping'],
      default: 'local_rajkot',
    },
    itemsSubtotal: {
      type: Number,
      required: true,
    },
    deliveryFee: {
      type: Number,
      default: 0,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    appliedCoupon: {
      code: String,
      discountType: String,
      discountValue: Number,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    totalWeightGrams: {
      type: Number,
      default: 0,
    },
    paymentMethod: {
      type: String,
      enum: ['razorpay', 'cod'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentDetails: {
      razorpayOrderId: String,
      razorpayPaymentId: String,
      razorpaySignature: String,
      paidAt: Date,
    },
    orderStatus: {
      type: String,
      enum: [
        'pending',
        'confirmed',
        'preparing',
        'packed',
        'dispatched',
        'delivered',
        'cancelled',
      ],
      default: 'pending',
    },
    trackingHistory: [trackingStepSchema],
    cancellationReason: {
      type: String,
      default: '',
    },
    customerNotes: {
      type: String,
      default: '',
    },
    adminNotes: {
      type: String,
      default: '',
    },
    whatsappNotification: {
      recipientName: { type: String, default: 'Deepa Bhansali' },
      recipientPhone: { type: String, default: '919316152114' },
      formattedMessage: { type: String, default: '' },
      waUrl: { type: String, default: '' },
      customerOpenedWa: { type: Boolean, default: false },
      openedAt: { type: Date },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
orderSchema.index({ customer: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1 });

module.exports = mongoose.model('Order', orderSchema);
