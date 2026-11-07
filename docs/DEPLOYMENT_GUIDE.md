# PRODUCTION DEPLOYMENT GUIDE
## Gujarati Homemade Snacks & Namkeen Platform

### 1. Production Architecture Overview

- **Frontend Hosting**: Vercel or Netlify (React 19 + Vite Static Build).
- **Backend Hosting**: Render, Railway, DigitalOcean App Platform, or Ubuntu VPS (Node.js/Express).
- **Database Engine**: Production MongoDB Community Server installed on a secured Linux instance or self-hosted replica set.

---

### 2. Frontend Deployment on Vercel

1. **Connect Repository**:
   Link your GitHub repository to [Vercel](https://vercel.com).
2. **Build Settings**:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
3. **Environment Variables**:
   Add in Vercel Project Settings:
   - `VITE_API_BASE_URL`: `https://your-backend-api.onrender.com/api`
4. **Vercel Rewrites for Client-Side Routing**:
   Create `frontend/vercel.json`:
   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
   }
   ```

---

### 3. Backend Deployment on Render or Ubuntu VPS

#### Option A: Deploying on Render
1. Create a **New Web Service** pointing to repository.
2. **Root Directory**: `backend`
3. **Runtime**: Node.js
4. **Build Command**: `npm install`
5. **Start Command**: `node server.js`
6. **Environment Variables**:
   ```env
   NODE_ENV=production
   PORT=10000
   CLIENT_URL=https://your-snacks-frontend.vercel.app
   MONGO_URI=mongodb://<DB_USER>:<DB_PASSWORD>@<YOUR_MONGODB_IP>:27017/gujarati_store?authSource=admin
   JWT_SECRET=super_secret_production_key_minimum_32_characters
   JWT_EXPIRE=7d
   RAZORPAY_KEY_ID=rzp_live_...
   RAZORPAY_KEY_SECRET=...
   RAZORPAY_WEBHOOK_SECRET=...
   ```

#### Option B: Deploying on Ubuntu VPS (Systemd + Nginx + PM2)
1. Install Node.js v24 and PM2:
   ```bash
   sudo npm install -g pm2
   ```
2. Run backend via PM2:
   ```bash
   cd /var/www/gujarati-snacks/backend
   pm2 start server.js --name "gujarati-snacks-api"
   pm2 save
   pm2 startup
   ```
3. Configure Nginx reverse proxy with SSL (Let's Encrypt Certbot).

---

### 4. Production Database Security Checklist

1. **Enable Authentication**:
   Edit `/etc/mongod.conf`:
   ```yaml
   security:
     authorization: "enabled"
   ```
2. **Bind IP Address**:
   Bind to private internal network IP or `127.0.0.1`. Never expose port `27017` to the public internet without firewall restrictions (`ufw allow from <BACKEND_IP> to any port 27017`).
3. **Automated Backups**:
   Set up daily cron job using `mongodump`:
   ```bash
   mongodump --db gujarati_store --out /var/backups/mongo/$(date +%F)
   ```

