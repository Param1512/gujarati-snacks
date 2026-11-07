const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Coupon code is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    discountType: {
      type: String,
      required: true,
      enum: ['percentage', 'fixed'],
    },
    discountValue: {
      type: Number,
      required: true,
      min: [1, 'Discount value must be at least 1'],
    },
    minOrderValue: {
      type: Number,
      default: 0,
      min: 0,
    },
    maxDiscount: {
      type: Number,
      // Caps maximum discount for percentage coupons
    },
    expiryDate: {
      type: Date,
      required: [true, 'Expiry date is required'],
    },
    usageLimit: {
      type: Number,
      default: 100,
      min: 1,
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

couponSchema.methods.isValid = function (cartTotal) {
  if (!this.isActive) return { valid: false, message: 'This coupon is inactive.' };
  if (new Date() > new Date(this.expiryDate)) return { valid: false, message: 'This coupon has expired.' };
  if (this.usedCount >= this.usageLimit) return { valid: false, message: 'This coupon usage limit has been reached.' };
  if (cartTotal < this.minOrderValue) {
    return {
      valid: false,
      message: `Minimum order value for this coupon is ₹${this.minOrderValue}.`,
    };
  }
  return { valid: true };
};

couponSchema.methods.calculateDiscount = function (cartTotal) {
  if (this.discountType === 'percentage') {
    let discount = (cartTotal * this.discountValue) / 100;
    if (this.maxDiscount && discount > this.maxDiscount) {
      discount = this.maxDiscount;
    }
    return Math.round(discount);
  } else {
    return Math.min(this.discountValue, cartTotal);
  }
};

module.exports = mongoose.model('Coupon', couponSchema);

