# ADMIN USER & STORE MANAGER MANUAL
## Gujarati Homemade Snacks & Namkeen Platform

### 1. Accessing the Admin Dashboard
1. Navigate to: `http://localhost:5173/login`
2. Sign in with administrator credentials created during installation:
   - **Email**: `admin@girirajnasta.com`
   - **Password**: *(Password set in `createAdmin.js`)*
3. You will be automatically redirected to `/admin`. Non-admin accounts attempting to reach `/admin` are forbidden.

---

### 2. Core Functional Modules

#### A. Analytics Dashboard (`/admin`)
- **Revenue Metrics**: Real-time Total Revenue, Today's Revenue, and Monthly Revenue calculated from actual orders in MongoDB.
- **Order Counters**: Total, Pending, Delivered, Preparing, Packed, Dispatched, Cancelled.
- **Bestselling Snacks**: Shows volume in kilograms and total sales.
- **Low-Stock Alerts**: Alerts if any snack has less than 2,000 grams (2 kg) left in kitchen stock.

#### B. Product Management (`/admin/products`)
- **Add New Snack**:
  - Click **Add New Snack** (`/admin/products/new`).
  - Enter English name (e.g. `Tikha Gathiya`) and Gujarati name (`તીખા ગાંઠીયા`).
  - Enter `Price Per Kilogram` (e.g., `500`). The preview panel immediately shows customer pack prices for 250g (₹125), 500g (₹250), 1kg (₹500), 2kg (₹1000).
  - Specify initial inventory in grams (e.g. 15000 = 15 kg).
  - Save record.
- **Edit / Delete**:
  - Update prices or toggle visibility without restarting server.

#### C. Order Processing & Fulfillment (`/admin/orders`)
- **Lifecycle Flow**:
  1. Customer places order: Status is `pending`.
  2. Kitchen confirms order: Change status to `confirmed`.
  3. Frying & Quality checks: Change status to `preparing`.
  4. Vacuum sealed & packed: Change status to `packed`.
  5. Handed to Rajkot delivery boy or courier: Change status to `dispatched`.
  6. Safely handed to customer: Change status to `delivered`.
- **Print Tax Invoices**:
  - Click the **Invoice** button on any order to render a printable GST-ready HTML invoice with store contact and weights.
- **Export CSV**:
  - Click **Export Orders CSV** to download a spreadsheet of all orders with financial subtotals, dates, and delivery addresses.

#### D. Inventory Management in Grams (`/admin/inventory`)
- Track exact inventory in **grams** to prevent unit errors.
- Click **Restock** on any item to log fresh morning batches (e.g. +10,000 grams).
- View **Audit Trail** to see who adjusted stock, when, and the exact reason.

#### E. Coupons (`/admin/coupons`)
- Create percentage or fixed discount vouchers with minimum order value and maximum discount caps.

#### F. Reviews Moderation (`/admin/reviews`)
- Approve or reject customer ratings before they appear on product pages.

#### G. Business & Delivery Settings (`/admin/settings`)
- Update Rajkot store address, phone number, WhatsApp inquiry number, delivery charges, and free delivery threshold.

