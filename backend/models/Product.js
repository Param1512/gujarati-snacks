const mongoose = require('mongoose');

const weightOptionSchema = new mongoose.Schema(
  {
    weightGrams: {
      type: Number,
      required: true,
      enum: [250, 500, 1000, 2000],
    },
    label: {
      type: String,
      required: true,
      // e.g. "250g", "500g", "1kg", "2kg"
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false }
);

const comboItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: String,
    weightGrams: {
      type: Number,
      required: true,
    },
    weightLabel: String,
    pricePerKg: Number,
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Snack name is required'],
      trim: true,
    },
    nameGujarati: {
      type: String,
      trim: true,
      default: '',
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Snack category is required'],
    },
    description: {
      type: String,
      required: [true, 'Snack description is required'],
    },
    descriptionGujarati: {
      type: String,
      default: '',
    },
    pricePerKg: {
      type: Number,
      required: [true, 'Price per kilogram is required'],
      min: [1, 'Price per kg must be greater than zero'],
    },
    weightOptions: {
      type: [weightOptionSchema],
      default: [
        { weightGrams: 250, label: '250 g', isActive: true },
        { weightGrams: 500, label: '500 g', isActive: true },
        { weightGrams: 1000, label: '1 kg', isActive: true },
        { weightGrams: 2000, label: '2 kg', isActive: true },
      ],
    },
    images: [
      {
        url: { type: String, required: true },
        alt: { type: String, default: '' },
        isPrimary: { type: Boolean, default: false },
      },
    ],
    // Special features
    isCombo: {
      type: Boolean,
      default: false,
    },
    comboItems: [comboItemSchema],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isBestseller: {
      type: Boolean,
      default: false,
    },
    isNewArrival: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    minOrderQty: {
      type: Number,
      default: 1,
      min: 1,
    },
    maxOrderQty: {
      type: Number,
      default: 20,
    },
    // Freshness & Verified Information (left empty if unverified)
    ingredients: {
      type: [String],
      default: [],
    },
    allergens: {
      type: [String],
      default: [],
    },
    shelfLife: {
      type: String,
      default: '',
    },
    storageInstructions: {
      type: String,
      default: '',
    },
    packagingDetails: {
      type: String,
      default: '',
    },
    preparationDate: {
      type: Date,
    },
    bestBeforeDate: {
      type: Date,
    },
    // Review aggregates
    ratings: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual to calculate prices dynamically for all active weight options
productSchema.virtual('calculatedPrices').get(function () {
  if (!this.weightOptions || !this.pricePerKg) return [];
  return this.weightOptions.map((opt) => ({
    weightGrams: opt.weightGrams,
    label: opt.label,
    isActive: opt.isActive,
    price: Math.round((this.pricePerKg * opt.weightGrams) / 1000),
  }));
});

// Helper static method to calculate exact backend price for a specific weight
productSchema.methods.calculatePriceForWeight = function (weightGrams) {
  return Math.round((this.pricePerKg * weightGrams) / 1000);
};

// Text index for search
productSchema.index({ name: 'text', description: 'text', nameGujarati: 'text' });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ isBestseller: 1 });

module.exports = mongoose.model('Product', productSchema);

