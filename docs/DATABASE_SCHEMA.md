# DATABASE SCHEMA DOCUMENTATION
## Gujarati Homemade Snacks & Namkeen Platform

### 1. Database Connection Specification
- **Engine**: MongoDB Community Server
- **GUI Management Client**: MongoDB Compass
- **Connection URI**: `mongodb://127.0.0.1:27017/gujarati_store`
- **ODM**: Mongoose with strict schema validation, indexes, and timestamps.

---

### 2. Entity Collections Overview

| Collection | Model File | Purpose | Key Indexes |
| :--- | :--- | :--- | :--- |
| `users` | `User.js` | Customer accounts & Store Administrator | `email: 1` (unique) |
| `categories` | `Category.js` | Snack groupings (Gathiya, Chevdo, etc.) | `slug: 1` (unique) |
| `products` | `Product.js` | Authentic Gujarati snacks & Combos | `slug: 1`, `category: 1`, text index on name/description |
| `inventories`| `Inventory.js`| Available & reserved stock in **Grams** | `product: 1` (unique) |
| `orders` | `Order.js` | Weight-based customer snack orders | `orderNumber: 1`, `customer: 1`, `orderStatus: 1` |
| `reviews` | `Review.js` | Genuine reviews with verified buyer tag | `product: 1, user: 1` (unique compound) |
| `coupons` | `Coupon.js` | Percentage & fixed discount vouchers | `code: 1` (unique) |
| `addresses` | `Address.js` | Customer saved shipping addresses | `user: 1` |
| `wishlists` | `Wishlist.js`| Customer favorite snacks | `user: 1` (unique) |
| `banners` | `Banner.js` | Food promotional homepage banners | `isActive: 1, sortOrder: 1` |
| `payments` | `Payment.js` | Razorpay signatures & transaction logs | `order: 1`, `razorpayOrderId: 1` |
| `businesssettings` | `BusinessSettings.js` | Store branding, delivery charges, policies | Singleton collection |
| `bulkorders` | `BulkOrder.js` | Wedding & function catering inquiries | `status: 1`, `createdAt: -1` |

---

### 3. Detailed Schema Definitions

#### A. `products`
```javascript
{
  name: { type: String, required: true },
  nameGujarati: { type: String },
  slug: { type: String, required: true, unique: true },
  category: { type: ObjectId, ref: 'Category', required: true },
  description: { type: String, required: true },
  pricePerKg: { type: Number, required: true }, // e.g. 500
  weightOptions: [
    { weightGrams: 250, label: '250 g', isActive: true },
    { weightGrams: 500, label: '500 g', isActive: true },
    { weightGrams: 1000, label: '1 kg', isActive: true },
    { weightGrams: 2000, label: '2 kg', isActive: true }
  ],
  images: [{ url: String, alt: String, isPrimary: Boolean }],
  isCombo: { type: Boolean, default: false },
  comboItems: [{ product: ObjectId, weightGrams: Number, quantity: Number }],
  isBestseller: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  shelfLife: { type: String },
  storageInstructions: { type: String },
  ratings: { average: Number, count: Number },
  createdAt: Date,
  updatedAt: Date
}
```

#### B. `inventories` (Strict Grams Unit System)
```javascript
{
  product: { type: ObjectId, ref: 'Product', required: true, unique: true },
  availableGrams: { type: Number, required: true, min: 0 }, // e.g. 15000 (15 kg)
  reservedGrams: { type: Number, default: 0 },
  lowStockThresholdGrams: { type: Number, default: 2000 }, // 2 kg
  stockUnit: { type: String, default: 'grams', immutable: true },
  adjustmentLogs: [
    {
      adjustmentGrams: Number, // e.g. -500 for order, +5000 for restock
      previousGrams: Number,
      newGrams: Number,
      reason: String, // 'initial_seed' | 'manual_restock' | 'order_confirmed' | 'order_cancelled_restored'
      referenceId: String, // Order Number
      adjustedBy: ObjectId,
      createdAt: Date
    }
  ]
}
```

#### C. `orders`
```javascript
{
  orderNumber: { type: String, unique: true }, // e.g. GNS-20261103-8472
  customer: { type: ObjectId, ref: 'User', required: true },
  orderItems: [
    {
      product: { type: ObjectId, ref: 'Product', required: true },
      name: String,
      pricePerKg: Number,
      weightGrams: Number, // 250, 500, 1000, 2000
      weightLabel: String, // '500 g'
      calculatedUnitPrice: Number, // (pricePerKg * weightGrams) / 1000
      quantity: Number,
      totalGrams: Number,
      itemSubtotal: Number,
      imageUrl: String
    }
  ],
  shippingAddress: {
    fullName: String, phone: String, addressLine1: String, city: String, state: String, pincode: String
  },
  deliveryType: { type: String, enum: ['local_rajkot', 'customer_pickup', 'standard_shipping'] },
  itemsSubtotal: Number,
  deliveryFee: Number,
  discountAmount: Number,
  totalAmount: Number,
  totalWeightGrams: Number,
  paymentMethod: { type: String, enum: ['cod', 'razorpay'] },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'] },
  orderStatus: { type: String, enum: ['pending', 'confirmed', 'preparing', 'packed', 'dispatched', 'delivered', 'cancelled'] },
  trackingHistory: [{ status: String, title: String, description: String, updatedAt: Date }]
}
```

