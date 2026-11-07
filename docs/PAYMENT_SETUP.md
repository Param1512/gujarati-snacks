# PAYMENT SETUP & VERIFICATION GUIDE
## Razorpay Test Mode & Cash on Delivery Integration

### 1. Payment Integration Architecture

The platform supports dual payment options:
1. **Online Digital Payments**: Razorpay Test Mode (UPI, Cards, Netbanking, Wallets).
2. **Cash on Delivery (COD)**: Administrator-configurable on/off via Store Settings.

> [!CAUTION]
> Never trust client-submitted payment states! The server always validates the order amount in paise, creates the Razorpay order, and verifies the HMAC SHA-256 signature before marking any order as `paid`.

---

### 2. Obtaining Razorpay Test Mode Credentials

1. Register or log in to the [Razorpay Dashboard](https://dashboard.razorpay.com).
2. Toggle the dashboard to **Test Mode** (located in the top-right or sidebar).
3. Navigate to **Account & Settings** -> **API Keys**.
4. Click **Generate Test Key**.
5. Copy the generated:
   - `Key Id` (e.g., `rzp_test_...`)
   - `Key Secret` (e.g., `...`)

---

### 3. Backend Environment Configuration

Open `backend/.env` and update the Razorpay keys:
```env
RAZORPAY_KEY_ID=rzp_test_YourGeneratedKeyIdHere
RAZORPAY_KEY_SECRET=YourGeneratedKeySecretHere
RAZORPAY_WEBHOOK_SECRET=YourWebhookSecretHere
```

---

### 4. How Verification Works

1. **Order Creation (`POST /api/orders`)**:
   - Backend calculates exact grand total based on current product prices, package weights in grams, delivery fee, and coupons.
   - If `paymentMethod === 'razorpay'`, calls `razorpay.orders.create({ amount: totalAmount * 100, currency: 'INR' })`.
   - Returns the Razorpay order ID to the client.

2. **Client Checkout**:
   - Frontend invokes Razorpay Checkout modal with the order ID.
   - Upon successful payment, Razorpay returns `razorpay_order_id`, `razorpay_payment_id`, and `razorpay_signature`.

3. **Backend Signature Verification (`POST /api/payments/verify`)**:
   ```javascript
   const generatedSignature = crypto
     .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
     .update(`${razorpayOrderId}|${razorpayPaymentId}`)
     .digest('hex');

   if (generatedSignature === razorpaySignature) {
     order.paymentStatus = 'paid';
     order.orderStatus = 'confirmed';
   }
   ```
4. **Duplicate Protection**:
   - Checks if `order.paymentStatus === 'paid'` to prevent duplicate processing.

---

### 5. Webhook Integration

Configure a webhook in Razorpay Dashboard pointing to:
```
https://yourdomain.com/api/payments/webhook
```
Select event: `payment.captured`.
Signature verified using `x-razorpay-signature` and `RAZORPAY_WEBHOOK_SECRET`.

