# 🥟 Giriraj Homemade Gujarati Snacks & Namkeen E-Commerce Platform

A complete, production-ready full-stack MERN e-commerce platform built from scratch for a family-owned Gujarati homemade snacks business located in Rajkot, Gujarat.

> **Strict Snacks-Only Scope**: This website exclusively sells authentic Gujarati homemade snacks and farsan. All festive decorations, diyas, torans, rangoli, and non-snack items are completely excluded.

---

## 🌟 Key Business & Technical Features

1. **10 Seeded Gujarati Snacks with Exact Per-Kg Rates**:
   - Tikha Gathiya – ₹500/kg
   - Plain Poha Chevdo – ₹400/kg
   - Chakdi (Chakli) – ₹500/kg
   - Jhaal Mudi – ₹500/kg
   - Masala Sing Daliya – ₹400/kg
   - Nimkin – ₹500/kg
   - Sev Mamra – ₹400/kg
   - Sev (Nylon/Besan Sev) – ₹400/kg
   - Methi Chatpati – ₹500/kg
   - Maida Puri (Farsi Puri) – ₹500/kg
2. **Weight-Based Shopping Engine**:
   - Pack options: **250 g**, **500 g**, **1 kg**, **2 kg**.
   - Formula: $\text{Price} = (\text{PricePerKg} \times \text{WeightGrams}) / 1000$.
   - Computed exclusively on the backend; never trusts client prices.
3. **Internal Stock Management in Grams**:
   - Prevents unit conversion rounding errors.
   - Initial stock of 15,000g (15 kg) per snack with automatic deduction upon order and restoration upon cancellation.
4. **Special Snack Features**:
   - **Custom Snack Combo Builder**: Combines multiple snacks (e.g. 250g Gathiya + 250g Sev Mamra + 500g Chevdo) with real-time server price calculation.
   - **Bulk Orders**: Catering inquiry form for weddings, family functions, and corporate gifting.
   - **Order Again (Reorder)**: Single-click cart rebuild from previous orders.
   - **Verified Freshness**: Daily morning frying batches, pure Sing-Tel (groundnut oil), shelf-life, and storage instructions.
   - **WhatsApp Integration**: Dynamic WhatsApp links with cart and snack details.
5. **Customer Storefront (20 Pages)**:
   - Homepage, All Snacks, Category Listing, Product Details, Search Results, Cart, Checkout, Login, Register, Profile, My Orders, Order Details, Order Tracking, Wishlist, Combo Builder, Bulk Orders, About Us, Contact Us, FAQ, Privacy Policy, Terms & Conditions, Shipping & Refund Policy.
6. **Protected Admin Dashboard**:
   - Real-time analytics: Total revenue, Today's revenue, Monthly revenue, Order counts by status, Bestselling snacks, Low-stock alerts (&lt; 2kg), Recent orders.
   - Product Management, Order Processing (pending -> confirmed -> preparing -> packed -> dispatched -> delivered), Tax Invoice generation, CSV export, Inventory adjustment audit trail, Customer management, Coupon engine, and Review moderation.
7. **Database Engine**:
   - MongoDB Community Server (`mongodb://127.0.0.1:27017/gujarati_store`), inspectable via MongoDB Compass.
8. **Payments & Delivery**:
   - Razorpay Test Mode with HMAC SHA-256 signature verification + Cash on Delivery (COD).
   - Rajkot local delivery (same-day / within 4-8 hours), Store pickup, and express courier. Free delivery above ₹999.
9. **Bilingual UI**:
   - English and Gujarati (ગુજરાતી) toggle.

---

## 🎨 Branding & Palette

- **Deep Maroon**: `#741B28`
- **Emerald Green**: `#174D35`
- **Warm Cream**: `#F6EBD2`
- **Gold**: `#D6A64B`
- **Dark Text**: `#29251F`

---

## 🚀 Quick Start Guide

### 1. Database & Backend Startup
```powershell
# Navigate to backend
cd c:\GujaratiNasta\backend

# Install dependencies
npm install

# Seed the 10 snacks and categories into MongoDB
npm run seed

# Create first secure admin account
npm run create-admin -- --email=admin@girirajnasta.com --password=GirirajAdmin2026!

# Run End-to-End Automated Test Suite
npm run test:e2e

# Start Backend API
npm run dev
# Server running at http://localhost:5000
```

### 2. Frontend Client Startup
```powershell
# Open a new terminal
cd c:\GujaratiNasta\frontend

# Install dependencies
npm install

# Start Vite React development server
npm run dev
# Client running at http://localhost:5173
```

---

## 📚 Technical Documentation Index

All in-depth architecture, database, API, and deployment documents are in [`docs/`](./docs/):
1. [`PROJECT_ARCHITECTURE.md`](./docs/PROJECT_ARCHITECTURE.md)
2. [`DATABASE_SCHEMA.md`](./docs/DATABASE_SCHEMA.md)
3. [`API_DOCUMENTATION.md`](./docs/API_DOCUMENTATION.md)
4. [`INSTALLATION_GUIDE.md`](./docs/INSTALLATION_GUIDE.md)
5. [`MONGODB_COMPASS_GUIDE.md`](./docs/MONGODB_COMPASS_GUIDE.md)
6. [`ADMIN_USER_GUIDE.md`](./docs/ADMIN_USER_GUIDE.md)
7. [`PAYMENT_SETUP.md`](./docs/PAYMENT_SETUP.md)
8. [`DEPLOYMENT_GUIDE.md`](./docs/DEPLOYMENT_GUIDE.md)
9. [`TESTING_REPORT.md`](./docs/TESTING_REPORT.md)

