# MONGODB COMPASS INSPECTION GUIDE
## Gujarati Homemade Snacks & Namkeen Platform

### 1. Database Architecture Distinction
- **MongoDB Community Server**: The background database engine service running on Windows (service name: `MongoDB`, port `27017`).
- **MongoDB Compass**: The graphical user interface (GUI) application used by developers and database administrators to visualize, inspect, query, and modify collections and documents.

> [!IMPORTANT]
> This platform strictly uses MongoDB Community Server. Do NOT use MongoDB Atlas.

---

### 2. Connecting to the Database via MongoDB Compass

1. Launch **MongoDB Compass** on your computer.
2. In the "New Connection" screen, enter the Connection String:
   ```
   mongodb://127.0.0.1:27017/gujarati_store
   ```
3. Click the green **Connect** button.
4. In the left navigation tree, select the database named **`gujarati_store`**.

---

### 3. Inspecting Core Snack Collections

#### A. Inspecting Products (`products`)
- Navigate to `gujarati_store` -> `products`.
- Click on **Documents** to view the 10 seeded snacks.
- In the Filter box, enter:
  ```json
  { "slug": "tikha-gathiya" }
  ```
  Click **Find** to inspect `pricePerKg: 500` and `weightOptions: [250, 500, 1000, 2000]`.

#### B. Inspecting Inventory in Grams (`inventories`)
- Navigate to `gujarati_store` -> `inventories`.
- Inspect `availableGrams: 15000` (15 kg) and the `adjustmentLogs` array.
- Run a query to find low stock items:
  ```json
  { "availableGrams": { "$lte": 2000 } }
  ```

#### C. Inspecting Customer Orders (`orders`)
- Navigate to `gujarati_store` -> `orders`.
- Observe `orderNumber` (e.g., `GNS-20261103-XXXX`), `orderItems` (with exact calculated unit price and item subtotal), `deliveryType`, and `trackingHistory`.

#### D. Inspecting Store Business Settings (`businesssettings`)
- View the singleton document storing `storeName`, `phone`, `whatsappNumber`, Rajkot address, and delivery charges.

---

### 4. Direct Manual Operations via Compass
- **Restocking a snack manually**:
  Find the product in `inventories`, update `availableGrams` (e.g. from `10000` to `20000`), and save.
- **Approving a Customer Review**:
  Open `reviews`, locate the review document, change `status: "pending"` to `"approved"`.

