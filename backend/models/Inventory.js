const mongoose = require('mongoose');

const adjustmentLogSchema = new mongoose.Schema(
  {
    adjustmentGrams: {
      type: Number,
      required: true,
      // Positive for restock, negative for deduction
    },
    previousGrams: {
      type: Number,
      required: true,
    },
    newGrams: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      required: true,
      enum: [
        'initial_seed',
        'manual_restock',
        'manual_deduction',
        'order_reserved',
        'order_confirmed',
        'order_cancelled_restored',
        'damage_or_waste',
      ],
    },
    referenceId: {
      type: String,
      default: '',
    },
    adjustedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const inventorySchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      unique: true,
    },
    availableGrams: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Available stock cannot be negative'],
    },
    reservedGrams: {
      type: Number,
      default: 0,
      min: [0, 'Reserved stock cannot be negative'],
    },
    lowStockThresholdGrams: {
      type: Number,
      default: 2000, // 2 kg default alert threshold
    },
    stockUnit: {
      type: String,
      default: 'grams',
      immutable: true,
    },
    adjustmentLogs: [adjustmentLogSchema],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for available Kg
inventorySchema.virtual('availableKg').get(function () {
  return (this.availableGrams / 1000).toFixed(2);
});

// Virtual for isLowStock
inventorySchema.virtual('isLowStock').get(function () {
  return this.availableGrams <= this.lowStockThresholdGrams;
});

module.exports = mongoose.model('Inventory', inventorySchema);

