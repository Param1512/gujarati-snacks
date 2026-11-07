const mongoose = require('mongoose');

const bulkOrderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Contact person name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    eventType: {
      type: String,
      required: true,
      enum: [
        'Family Function',
        'Wedding Ceremony',
        'Corporate Gifting',
        'Festival Gathering',
        'Snack Box Catering',
        'Community Event',
        'Other',
      ],
      default: 'Family Function',
    },
    approximateGuests: {
      type: Number,
      default: 50,
    },
    preferredSnacks: {
      type: [String],
      default: [],
    },
    approximateQuantityKg: {
      type: Number,
      required: true,
      min: [5, 'Bulk orders minimum threshold is 5 kg'],
    },
    eventDate: {
      type: Date,
    },
    deliveryAddress: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      default: 'Rajkot',
    },
    pincode: {
      type: String,
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'quoted', 'confirmed', 'completed', 'cancelled'],
      default: 'new',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('BulkOrder', bulkOrderSchema);

