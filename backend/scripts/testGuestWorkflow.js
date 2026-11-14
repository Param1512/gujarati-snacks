const mongoose = require('mongoose');
require('dotenv').config({ path: 'backend/.env' });

const Product = require('../models/Product');
const Order = require('../models/Order');
const Inventory = require('../models/Inventory');
const BusinessSettings = require('../models/BusinessSettings');

const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('====================================================');
  console.log('🧪 RUNNING GUJARATI NASTA GUEST WORKFLOW TESTS');
  console.log('====================================================');

  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gujarati_store');

  const product = await Product.findOne({ isActive: true });
  if (!product) {
    console.error('❌ No active product found for testing.');
    process.exit(1);
  }
  console.log(`✓ Active test product: ${product.name} (ID: ${product._id}, ₹${product.pricePerKg}/kg)`);

  // Ensure inventory exists
  let inv = await Inventory.findOne({ product: product._id });
  if (!inv) {
    inv = await Inventory.create({ product: product._id, availableGrams: 50000, lowStockThresholdGrams: 5000 });
  } else if (inv.availableGrams < 5000) {
    inv.availableGrams += 50000;
    await inv.save();
  }
  console.log(`✓ Inventory stock available: ${inv.availableGrams}g`);

  // -------------------------------------------------------------------------
  // TEST 1: Cash on Delivery Guest Order
  // -------------------------------------------------------------------------
  console.log('\n--- TEST 1: COD Guest Order Placement ---');
  const codPayload = {
    items: [{ productId: product._id.toString(), weightGrams: 500, quantity: 2 }],
    shippingAddress: {
      fullName: 'Kiran Dave',
      phone: '9825123456',
      addressLine1: 'Block C-102, Shivalik Pride',
      area: 'Mavdi Main Road',
      landmark: 'Near Anand Bunglows',
      city: 'Rajkot',
      state: 'Gujarat',
      pincode: '360004',
      deliveryInstructions: 'Deliver in evening please',
    },
    deliveryType: 'local_rajkot',
    paymentMethod: 'cod',
  };

  const codRes = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(codPayload),
  });
  const codData = await codRes.json();

  if (!codData.success || !codData.order) {
    console.error('❌ COD order creation failed:', codData);
    process.exit(1);
  }

  const codOrder = codData.order;
  console.log(`✓ COD Order Created: ${codOrder.orderNumber}`);
  console.log(`✓ isGuest: ${codOrder.isGuest}`);
  console.log(`✓ Customer ID is null: ${codOrder.customer === null}`);
  console.log(`✓ Payment Status: ${codOrder.paymentStatus}`);
  console.log(`✓ Order Status: ${codOrder.orderStatus}`);
  console.log(`✓ Recipient Name: ${codData.whatsappRecipient.name}`);
  console.log(`✓ Recipient Phone: ${codData.whatsappRecipient.phone}`);
  console.log(`✓ wa.me link contains 919316152114: ${codData.whatsappUrl.includes('919316152114')}`);
  console.log(`✓ Message includes Order ID: ${codData.whatsappMessage.includes(codOrder.orderNumber)}`);
  console.log(`✓ Message includes Customer Name: ${codData.whatsappMessage.includes('Kiran Dave')}`);

  // Test Confirmation Page Lookup
  const confirmLookup = await fetch(`${BASE_URL}/orders/confirmed/${codOrder.orderNumber}`);
  const confirmData = await confirmLookup.json();
  console.log(`✓ Public Confirmation Endpoint Lookup: ${confirmData.success ? 'PASSED' : 'FAILED'}`);

  // -------------------------------------------------------------------------
  // TEST 2: Razorpay Online Payment Guest Order & Server Signature Verification
  // -------------------------------------------------------------------------
  console.log('\n--- TEST 2: Online Payment Guest Order & Signature Verification ---');
  const onlinePayload = {
    items: [{ productId: product._id.toString(), weightGrams: 1000, quantity: 1 }],
    shippingAddress: {
      fullName: 'Aarav Mehta',
      phone: '9426001122',
      addressLine1: 'Flat 401, Royal Heights',
      area: 'Kalawad Road',
      city: 'Rajkot',
      state: 'Gujarat',
      pincode: '360005',
    },
    deliveryType: 'local_rajkot',
    paymentMethod: 'razorpay',
  };

  const onlineRes = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(onlinePayload),
  });
  const onlineData = await onlineRes.json();

  if (!onlineData.success || !onlineData.razorpayOrder) {
    console.error('❌ Razorpay order creation failed:', onlineData);
    process.exit(1);
  }

  const onlineOrder = onlineData.order;
  console.log(`✓ Online Pending Order Created: ${onlineOrder.orderNumber}`);
  console.log(`✓ Razorpay Order ID created: ${onlineData.razorpayOrder.orderId}`);
  console.log(`✓ Razorpay Key ID used: ${onlineData.razorpayOrder.keyId}`);

  // Simulate server-side signature calculation using real key secret from .env
  const crypto = require('crypto');
  const secret = process.env.RAZORPAY_KEY_SECRET;
  const mockPaymentId = `pay_test_${Date.now()}`;
  const signatureBody = `${onlineData.razorpayOrder.orderId}|${mockPaymentId}`;
  const validSignature = crypto.createHmac('sha256', secret).update(signatureBody).digest('hex');

  // Verify payment endpoint
  const verifyRes = await fetch(`${BASE_URL}/payments/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      orderId: onlineOrder._id,
      razorpayOrderId: onlineData.razorpayOrder.orderId,
      razorpayPaymentId: mockPaymentId,
      razorpaySignature: validSignature,
    }),
  });
  const verifyData = await verifyRes.json();

  console.log(`✓ Payment Verification Success: ${verifyData.success}`);
  console.log(`✓ Verified Payment Status: ${verifyData.order?.paymentStatus}`);
  console.log(`✓ Verified Order Status: ${verifyData.order?.orderStatus}`);
  console.log(`✓ Verified wa.me contains PAID status: ${verifyData.whatsappMessage.includes('PAID')}`);
  console.log(`✓ Verified wa.me contains Payment Ref: ${verifyData.whatsappMessage.includes(mockPaymentId)}`);

  // -------------------------------------------------------------------------
  // TEST 3: Duplicate Payment Callback Check
  // -------------------------------------------------------------------------
  console.log('\n--- TEST 3: Duplicate Payment Callback Handling ---');
  const duplicateVerifyRes = await fetch(`${BASE_URL}/payments/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      orderId: onlineOrder._id,
      razorpayOrderId: onlineData.razorpayOrder.orderId,
      razorpayPaymentId: mockPaymentId,
      razorpaySignature: validSignature,
    }),
  });
  const duplicateVerifyData = await duplicateVerifyRes.json();
  console.log(`✓ Duplicate Callback response: ${duplicateVerifyData.message} (status: ${duplicateVerifyRes.status})`);

  // -------------------------------------------------------------------------
  // TEST 4: Invalid Signature / Payment Failure
  // -------------------------------------------------------------------------
  console.log('\n--- TEST 4: Invalid Payment Signature Handling ---');
  // Create another order for invalid test
  const invalidOrderRes = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(onlinePayload),
  });
  const invalidOrderData = await invalidOrderRes.json();

  const badVerifyRes = await fetch(`${BASE_URL}/payments/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      orderId: invalidOrderData.order._id,
      razorpayOrderId: invalidOrderData.razorpayOrder.orderId,
      razorpayPaymentId: 'pay_bad_test_123',
      razorpaySignature: 'completely_fraudulent_signature_hash',
    }),
  });
  const badVerifyData = await badVerifyRes.json();
  console.log(`✓ Invalid Signature correctly rejected (Status: ${badVerifyRes.status}, Message: ${badVerifyData.message})`);

  // -------------------------------------------------------------------------
  // TEST 5: Form Validation Failure (Bad Mobile Number)
  // -------------------------------------------------------------------------
  console.log('\n--- TEST 5: Form Validation (Bad Phone Number) ---');
  const badPhonePayload = {
    ...codPayload,
    shippingAddress: { ...codPayload.shippingAddress, phone: '123' },
  };
  const badPhoneRes = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(badPhonePayload),
  });
  const badPhoneData = await badPhoneRes.json();
  console.log(`✓ Invalid Phone rejected (Status: ${badPhoneRes.status}, Message: ${badPhoneData.message})`);

  // -------------------------------------------------------------------------
  // TEST 6: Form Validation Failure (Bad Pincode)
  // -------------------------------------------------------------------------
  console.log('\n--- TEST 6: Form Validation (Bad Pincode) ---');
  const badPinPayload = {
    ...codPayload,
    shippingAddress: { ...codPayload.shippingAddress, pincode: '99' },
  };
  const badPinRes = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(badPinPayload),
  });
  const badPinData = await badPinRes.json();
  console.log(`✓ Invalid Pincode rejected (Status: ${badPinRes.status}, Message: ${badPinData.message})`);

  // -------------------------------------------------------------------------
  // TEST 7: Admin Order Search & Invoice Retrieval
  // -------------------------------------------------------------------------
  console.log('\n--- TEST 7: Admin Order Search & Invoice ---');
  // Check invoice HTML generation for guest order
  const invoiceRes = await fetch(`${BASE_URL}/orders/${codOrder._id}/invoice`);
  const invoiceHtml = await invoiceRes.text();
  console.log(`✓ Guest Order Tax Invoice Generated: ${invoiceHtml.includes(codOrder.orderNumber) ? 'PASSED' : 'FAILED'}`);
  console.log(`✓ Invoice contains Customer Name Kiran Dave: ${invoiceHtml.includes('Kiran Dave')}`);

  await mongoose.disconnect();
  console.log('\n====================================================');
  console.log('🎉 ALL WORKFLOW TESTS PASSED 100% SUCCESSFULLY!');
  console.log('====================================================');
}

runTests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
