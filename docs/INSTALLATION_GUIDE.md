# INSTALLATION AND SETUP GUIDE
## Gujarati Homemade Snacks & Namkeen Platform

### Prerequisites
- **Node.js**: v18.0.0 or higher (v24 tested)
- **npm**: v9.0.0 or higher
- **MongoDB Community Server**: Running locally on port 27017

---

### Step 1: Clone or Navigate to Project Directory
```powershell
cd c:\GujaratiNasta
```

---

### Step 2: Backend Setup & Dependency Installation
```powershell
cd c:\GujaratiNasta\backend
npm install
```

Configure environment file:
Ensure `.env` exists in `backend/` with:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://127.0.0.1:27017/gujarati_store
JWT_SECRET=gujarati_nasta_super_secret_jwt_key_2026_authentic_homemade
JWT_EXPIRE=7d
RAZORPAY_KEY_ID=rzp_test_GujaratiSnacksDemoKey
RAZORPAY_KEY_SECRET=GujaratiSnacksDemoSecret123
RAZORPAY_WEBHOOK_SECRET=GujaratiWebhookSecret123
```

---

### Step 3: Seed Database with Categories & 10 Mandatory Snacks
Run the idempotent seed script:
```powershell
npm run seed
```
This populates:
- 5 Authentic snack categories
- All 10 mandatory snacks with verified per-kg rates:
  1. Tikha Gathiya (₹500/kg)
  2. Plain Poha Chevdo (₹400/kg)
  3. Chakdi (₹500/kg)
  4. Jhaal Mudi (₹500/kg)
  5. Masala Sing Daliya (₹400/kg)
  6. Nimkin (₹500/kg)
  7. Sev Mamra (₹400/kg)
  8. Sev (₹400/kg)
  9. Methi Chatpati (₹500/kg)
  10. Maida Puri (₹500/kg)
- Kathiyawadi Evening Tea Combo
- 15,000 grams (15kg) initial stock per snack in `inventories` collection
- Store configuration & welcome coupons (`SWAGAT10`, `GIRIRAJ50`)

---

### Step 4: Create Secure First Administrator Account
```powershell
npm run create-admin -- --email=admin@girirajnasta.com --password=GirirajAdmin2026! --name="Giriraj Master Admin" --phone="+919825012345"
```

---

### Step 5: Frontend Setup
```powershell
cd c:\GujaratiNasta\frontend
npm install
npm run build
```

---

### Step 6: Running Development Servers

Open two terminal windows:

**Terminal 1 (Backend API)**:
```powershell
cd c:\GujaratiNasta\backend
npm run dev
# Running on http://localhost:5000
```

**Terminal 2 (Frontend Client)**:
```powershell
cd c:\GujaratiNasta\frontend
npm run dev
# Running on http://localhost:5173
```
Open your browser at `http://localhost:5173`.

