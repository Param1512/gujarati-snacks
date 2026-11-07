const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
  },
  { _id: false }
);

const businessSettingsSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      default: 'Giriraj Homemade Gujarati Snacks',
      required: true,
      trim: true,
    },
    storeNameGujarati: {
      type: String,
      default: 'ગિરિરાજ હોમમેડ ગુજરાતી નાસ્તા',
      trim: true,
    },
    tagline: {
      type: String,
      default: 'Authentic Kathiyawadi Namkeen, Made Fresh Daily With Pure Groundnut Oil',
    },
    logoUrl: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '+91 98250 12345',
    },
    whatsappNumber: {
      type: String,
      default: '919825012345',
    },
    email: {
      type: String,
      default: 'orders@girirajnasta.com',
    },
    address: {
      shopNo: { type: String, default: 'Shop 4, Shreeji Complex' },
      street: { type: String, default: '150 Feet Ring Road' },
      area: { type: String, default: 'Near Indira Circle' },
      city: { type: String, default: 'Rajkot' },
      state: { type: String, default: 'Gujarat' },
      pincode: { type: String, default: '360005' },
    },
    operatingStatus: {
      type: String,
      enum: ['open', 'closed', 'taking_preorders'],
      default: 'open',
    },
    allowCashOnDelivery: {
      type: Boolean,
      default: true,
    },
    deliveryCharges: {
      localRajkot: {
        type: Number,
        default: 30, // ₹30 delivery inside Rajkot
      },
      standardShipping: {
        type: Number,
        default: 70, // ₹70 shipping outside Rajkot
      },
      customerPickup: {
        type: Number,
        default: 0,
      },
    },
    freeDeliveryThreshold: {
      type: Number,
      default: 999, // Free delivery for orders above ₹999
    },
    supportedPincodes: {
      type: [String],
      default: [
        '360001',
        '360002',
        '360003',
        '360004',
        '360005',
        '360006',
        '360007',
        '360020',
        '380001',
        '380009',
        '380015',
        '390001',
        '395001',
        '400001',
      ],
    },
    socialLinks: {
      instagram: { type: String, default: 'https://instagram.com/girirajnasta' },
      facebook: { type: String, default: 'https://facebook.com/girirajnasta' },
      youtube: { type: String, default: '' },
    },
    policies: {
      privacyPolicy: {
        type: String,
        default:
          'We respect your privacy. All customer data collected during checkout is strictly used to fulfill snack orders and deliver fresh homemade savouries to your doorstep. We never sell your personal contact details.',
      },
      termsAndConditions: {
        type: String,
        default:
          'All snack items are freshly prepared in hygienic conditions. Orders are dispatched within 24-48 hours. By placing an order, you agree to inspect the parcel upon delivery.',
      },
      shippingAndRefund: {
        type: String,
        default:
          'Local deliveries in Rajkot are delivered within 4-8 hours or next morning. Gujarat and Interstate shipments arrive within 2-4 business days. Because snacks are perishable homemade food products, returns are accepted only in case of package tampering or transit damage reported within 24 hours of delivery.',
      },
      aboutUs: {
        type: String,
        default:
          'Giriraj Homemade Gujarati Snacks started in our family kitchen in Rajkot with a commitment to pure taste, genuine spices, pure sing-tel (groundnut oil), and zero artificial preservatives. Every batch of Gathiya, Chevdo, Chakdi, and Sev is hand-crafted following time-tested ancestral recipes.',
      },
      faq: {
        type: [faqSchema],
        default: [
          {
            question: 'Do you use pure groundnut oil (Sing-tel)?',
            answer:
              'Yes, 100% pure filtered groundnut oil is used for all our fried snacks, giving them the authentic, crispy Kathiyawadi aroma and taste.',
          },
          {
            question: 'How fresh are the snacks when shipped?',
            answer:
              'We prepare batches daily. Orders received are packed from the day’s freshly made batch and sealed in air-tight food-grade pouches.',
          },
          {
            question: 'Can I select different weights for each snack?',
            answer:
              'Yes! You can choose 250g, 500g, 1kg, or 2kg for any snack, or use our Custom Snack Combo Builder to mix and match multiple snacks.',
          },
          {
            question: 'Do you deliver outside Rajkot?',
            answer:
              'Yes, we ship across Gujarat and all major metro cities across India via express courier.',
          },
        ],
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('BusinessSettings', businessSettingsSchema);
