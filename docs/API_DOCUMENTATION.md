# REST API DOCUMENTATION
## Gujarati Homemade Snacks & Namkeen Platform

Base URL: `http://localhost:5000/api`

---

### 1. Authentication & Customer Profile (`/api/auth`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new customer account (`name`, `email`, `password`, `phone`) |
| `POST` | `/api/auth/login` | Public | Sign in user & receive JWT token in HTTP-only cookie + response body |
| `POST` | `/api/auth/logout` | Public | Invalidate HTTP-only cookie |
| `GET` | `/api/auth/me` | Protected | Get authenticated profile & saved addresses |
| `PUT` | `/api/auth/profile` | Protected | Update profile name and phone |
| `PUT` | `/api/auth/change-password` | Protected | Change account password |
| `GET` | `/api/auth/addresses` | Protected | List customer saved delivery addresses |
| `POST` | `/api/auth/addresses` | Protected | Add new shipping address |
| `PUT` | `/api/auth/addresses/:id` | Protected | Update existing address |
| `DELETE` | `/api/auth/addresses/:id` | Protected | Remove saved address |

---

### 2. Products & Pricing Engine (`/api/products`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | Public | List snacks with category, price range, search, stock, and sorting |
| `GET` | `/api/products/:identifier` | Public | Get snack by ID or slug with inventory & related snacks |
| `POST` | `/api/products/custom-combo/calculate` | Public | Calculate dynamic price & stock for Custom Snack Combo Builder |
| `POST` | `/api/products` | Admin | Create new snack product with initial stock in grams |
| `PUT` | `/api/products/:id` | Admin | Update price per kg, weight options, description, images |
| `DELETE` | `/api/products/:id` | Admin | Delete snack product and associated inventory |

---

### 3. Order Management (`/api/orders`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/orders` | Protected | Create order with full server-side price & weight recalculation |
| `GET` | `/api/orders/my-orders` | Protected | List logged-in customer's orders |
| `GET` | `/api/orders/:identifier` | Protected | View order details (owner or admin) |
| `GET` | `/api/orders/track/:orderNumber`| Public | Live parcel tracking by order number & phone |
| `POST` | `/api/orders/:id/cancel` | Protected | Cancel order before dispatch & restore inventory in grams |
| `GET` | `/api/orders/reorder/:id` | Protected | Generate reorder payload for previous cart items |
| `GET` | `/api/orders/:id/invoice` | Protected | Render printable HTML Tax Invoice |
| `GET` | `/api/orders` | Admin | Search and filter all orders |
| `PUT` | `/api/orders/:id/status` | Admin | Update order status (`confirmed`, `preparing`, `packed`, `dispatched`, `delivered`) |
| `GET` | `/api/orders/export/csv` | Admin | Export order records as CSV |

---

### 4. Inventory in Grams (`/api/inventory`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/inventory` | Admin | Get stock status for all products in grams & kg with low stock alerts |
| `PUT` | `/api/inventory/:productId` | Admin | Restock or adjust stock in grams with reason log |
| `GET` | `/api/inventory/:productId/logs` | Admin | Audit trail of all stock additions and deductions |

---

### 5. Coupons, Reviews, Settings & Bulk Enquiries

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/coupons/validate` | Public | Validate coupon code against cart total |
| `GET` | `/api/coupons` | Admin | Manage promotional coupons |
| `GET` | `/api/reviews/product/:id` | Public | Approved reviews for a snack |
| `POST` | `/api/reviews` | Protected | Submit customer review |
| `GET` | `/api/reviews` | Admin | Moderate reviews (approve/reject) |
| `GET` | `/api/settings` | Public | Store settings, phone, WhatsApp number, delivery rules |
| `PUT` | `/api/settings` | Admin | Update store settings, logo, address, operating status |
| `POST` | `/api/bulk-orders` | Public | Submit bulk order inquiry for catering/functions |
| `GET` | `/api/bulk-orders` | Admin | List and update bulk catering inquiries |
| `POST` | `/api/payments/verify` | Protected | Verify Razorpay payment signature securely |

