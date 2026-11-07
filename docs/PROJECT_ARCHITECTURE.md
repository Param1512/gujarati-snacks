# PROJECT ARCHITECTURE
## Gujarati Homemade Snacks & Namkeen E-Commerce Platform

### 1. Executive Architectural Overview

This platform is engineered as a robust full-stack MERN (MongoDB, Express, React, Node.js) web application designed exclusively for a family-owned Gujarati homemade snacks business based in Rajkot, Gujarat. The system completely omits any unrelated festive decorations and focuses strictly on weight-based snack commerce, fresh batch inventory tracking, and dynamic decimal price calculations.

```
┌─────────────────────────────────────────────────────────────────┐
│                       Client Tier (Browser)                     │
│  - React 19 + Vite + Tailwind CSS + Lucide React + Context API  │
│  - Customer Storefront (20 Pages) & Interactive Combo Builder   │
│  - Protected Admin Operations & Analytics Dashboard             │
└─────────────────────────────────┬───────────────────────────────┘
                                  │ HTTPS / RESTful JSON / Cookies
┌─────────────────────────────────▼───────────────────────────────┐
│                 Application Server Tier (Node.js/Express)        │
│  - Helmet Security Headers & Rate Limiting                      │
│  - JWT Authentication + bcrypt password hashing                 │
│  - Weight-Based Pricing Engine: (Price/kg * Weight_g) / 1000    │
│  - Razorpay Online Payments & Cash on Delivery (COD)            │
│  - Centralized Error Handling & Invoicing Services              │
└─────────────────────────────────┬───────────────────────────────┘
                                  │ Mongoose ODM / Port 27017
┌─────────────────────────────────▼───────────────────────────────┐
│                      Database Tier (MongoDB)                    │
│  - MongoDB Community Server Engine (mongodb://127.0.0.1:27017)  │
│  - Inspected via MongoDB Compass GUI                            │
│  - 13 Collections: users, products, categories, orders,         │
│    inventory, reviews, coupons, addresses, wishlists, banners,  │
│    payments, businessSettings, bulkOrders                       │
│  - Inventory Handled Exclusively in GRAMS to avoid unit errors  │
└─────────────────────────────────────────────────────────────────┘
```

### 2. Frontend Architectural Structure

- **Core Framework**: React 19 bundled via Vite 8.
- **Styling Architecture**: Tailwind CSS v4 using brand custom palette:
  - Deep Maroon: `#741B28`
  - Emerald Green: `#174D35`
  - Warm Cream: `#F6EBD2`
  - Gold: `#D6A64B`
  - Dark Charcoal: `#29251F`
- **Routing**: `react-router-dom` v7 with nested routing separating public customer storefront routes and protected `/admin` control panels.
- **State Management**: React Context API:
  - `AuthContext`: Authentication token, session restore, user roles (customer vs. admin).
  - `CartContext`: Line items with multi-weight granularity (`${productId}_${weightGrams}`), live subtotal, total weight calculations in kg/g, and dynamic WhatsApp message generation.
  - `WishlistContext`: Product bookmarking with automatic cloud persistence.
  - `LanguageContext`: Multilingual toggle for English and Gujarati scripts.
  - `SettingsContext`: Global store policies, delivery rates, and contact numbers.

### 3. Backend Architectural Structure

- **Server Runtime**: Node.js v24 with Express.js REST APIs.
- **Security Middlewares**:
  - `helmet`: Secure HTTP headers.
  - `express-rate-limit`: Brute-force and API abuse prevention.
  - `cookieParser`: Secure HTTP-only cookies.
  - `cors`: Restricted origins with credentials allowed.
  - `authMiddleware`: JWT token verification and role-based access control.
- **Controllers & Business Logic**:
  - `orderController.js`: Full server-side price calculation. Rejects client-supplied prices; re-fetches product price per kg and re-computes `(pricePerKg * weightGrams) / 1000`.
  - `inventoryController.js`: Stock managed strictly in **Grams**. Deducts on order confirmation, releases on cancellation, and maintains an adjustment log for every gram changed.
  - `productController.js`: Supports individual snack items, configurable weight options (250g, 500g, 1kg, 2kg), and dynamic combo price calculations.

### 4. Weight-Based Shopping Engine

To prevent unit conversion rounding errors and inventory mismatches:
1. Every snack product has an administrator-configured `pricePerKg`.
2. Pack options are defined in grams: `250`, `500`, `1000`, `2000`.
3. All database inventory levels and deductions are tracked in **Grams**.
4. Formula:
   $$\text{Pack Price} = \text{round}\left(\frac{\text{Price Per Kg} \times \text{Weight in Grams}}{1000}\right)$$
5. Example:
   - Tikha Gathiya at ₹500/kg:
     - 250 g: $(500 \times 250) / 1000 = ₹125$
     - 500 g: $(500 \times 500) / 1000 = ₹250$
     - 1 kg: $(500 \times 1000) / 1000 = ₹500$
     - 2 kg: $(500 \times 2000) / 1000 = ₹1,000$

