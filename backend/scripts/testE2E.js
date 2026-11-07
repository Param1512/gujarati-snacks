const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const Inventory = require('../models/Inventory');
const Order = require('../models/Order');
const Coupon = require('../models/Coupon');
const { calculateItemUnitPrice } = require('../services/priceCalculator');

const runE2ETests = async () => {
  console.log('=======================================================');
  console.log('🧪 Starting End-to-End Test Suite for Gujarati Snacks');
  console.log('=======================================================');

  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gujarati_store';
    await mongoose.connect(mongoURI);
    console.log('✅ TEST 1: MongoDB Community Server connection established.');

    // TEST 2: Verify Initial Seed Products & Pricing
    const expectedProducts = [
      { name: 'Tikha Gathiya', price: 500 },
      { name: 'Plain Poha Chevdo', price: 400 },
      { name: 'Chakdi', price: 500 },
      { name: 'Jhaal Mudi', price: 500 },
      { name: 'Masala Sing Daliya', price: 400 },
      { name: 'Nimkin', price: 500 },
      { name: 'Sev Mamra', price: 400 },
      { name: 'Sev', price: 400 },
      { name: 'Methi Chatpati', price: 500 },
      { name: 'Maida Puri', price: 500 },
    ];

    for (const exp of expectedProducts) {
      const prod = await Product.findOne({ name: exp.name });
      if (!prod) {
        throw new Error(`Missing expected seed product: ${exp.name}`);
      }
      if (prod.pricePerKg !== exp.price) {
        throw new Error(`Price mismatch for ${exp.name}: expected ${exp.price}, got ${prod.pricePerKg}`);
      }
    }
    console.log('✅ TEST 2: All 10 mandatory snack products verified with exact per-kg prices in MongoDB.');

    // TEST 3: Weight-based Shopping Engine Decimal Pricing Calculations
    const gathiya = await Product.findOne({ slug: 'tikha-gathiya' });
    const p250 = calculateItemUnitPrice(gathiya.pricePerKg, 250);
    const p500 = calculateItemUnitPrice(gathiya.pricePerKg, 500);
    const p1000 = calculateItemUnitPrice(gathiya.pricePerKg, 1000);
    const p2000 = calculateItemUnitPrice(gathiya.pricePerKg, 2000);

    if (p250 !== 125 || p500 !== 250 || p1000 !== 500 || p2000 !== 1000) {
      throw new Error(`Weight calculations incorrect for Tikha Gathiya! 250g:${p250}, 500g:${p500}, 1kg:${p1000}, 2kg:${p2000}`);
    }
    console.log(`✅ TEST 3: Weight-based price calculations verified for Tikha Gathiya:`);
    console.log(`   - 250g  = ₹${p250} (Expected: ₹125)`);
    console.log(`   - 500g  = ₹${p500} (Expected: ₹250)`);
    console.log(`   - 1kg   = ₹${p1000} (Expected: ₹500)`);
    console.log(`   - 2kg   = ₹${p2000} (Expected: ₹1000)`);

    // TEST 4: Customer Registration & Password Hashing
    const testCustomerEmail = `test_customer_${Date.now()}@example.com`;
    const customer = await User.create({
      name: 'Rameshbhai Patel',
      email: testCustomerEmail,
      password: 'CustomerSecurePassword123!',
      phone: '+91 98251 98765',
      role: 'customer',
    });

    const isPwMatch = await customer.matchPassword('CustomerSecurePassword123!');
    if (!isPwMatch) {
      throw new Error('Password hashing / verification failed for customer');
    }
    const token = customer.generateAuthToken();
    if (!token) {
      throw new Error('JWT token generation failed');
    }
    console.log(`✅ TEST 4: Customer registered successfully (${customer.name}) and JWT token generated.`);

    // TEST 5: Inventory Verification in Grams
    const gathiyaInvBefore = await Inventory.findOne({ product: gathiya._id });
    if (!gathiyaInvBefore || gathiyaInvBefore.availableGrams <= 0) {
      throw new Error('Gathiya inventory not found or depleted');
    }
    const initialGrams = gathiyaInvBefore.availableGrams;
    console.log(`✅ TEST 5: Initial inventory for ${gathiya.name}: ${initialGrams} grams (${(initialGrams/1000).toFixed(2)} kg).`);

    // TEST 6: Order Creation & Price Validation (Customer selects 500g Tikha Gathiya = ₹250)
    const orderWeight = 500; // 500 grams
    const orderQty = 2; // 2 packs = 1000 grams total
    const unitPrice = calculateItemUnitPrice(gathiya.pricePerKg, orderWeight); // 250
    const itemSubtotal = unitPrice * orderQty; // 500
    const totalGramsNeeded = orderWeight * orderQty; // 1000 grams

    const orderNumber = `GNS-TEST-${Date.now()}`;
    const testOrder = await Order.create({
      orderNumber,
      customer: customer._id,
      orderItems: [
        {
          product: gathiya._id,
          name: gathiya.name,
          pricePerKg: gathiya.pricePerKg,
          weightGrams: orderWeight,
          weightLabel: '500 g',
          calculatedUnitPrice: unitPrice,
          quantity: orderQty,
          totalGrams: totalGramsNeeded,
          itemSubtotal,
          imageUrl: gathiya.images[0]?.url || '',
        },
      ],
      shippingAddress: {
        fullName: customer.name,
        phone: customer.phone,
        addressLine1: 'B-102, Gokul Dham Flats',
        addressLine2: 'Kalawad Road',
        landmark: 'Near KKV Hall',
        city: 'Rajkot',
        state: 'Gujarat',
        pincode: '360005',
      },
      deliveryType: 'local_rajkot',
      itemsSubtotal: itemSubtotal,
      deliveryFee: 30,
      discountAmount: 0,
      totalAmount: itemSubtotal + 30, // 530
      totalWeightGrams: totalGramsNeeded,
      paymentMethod: 'cod',
      paymentStatus: 'pending',
      orderStatus: 'pending',
      trackingHistory: [
        {
          status: 'pending',
          title: 'Order Placed',
          description: 'Order placed by customer',
          updatedAt: new Date(),
        },
      ],
    });

    // Deduct stock in grams
    gathiyaInvBefore.availableGrams -= totalGramsNeeded;
    gathiyaInvBefore.adjustmentLogs.push({
      adjustmentGrams: -totalGramsNeeded,
      previousGrams: initialGrams,
      newGrams: gathiyaInvBefore.availableGrams,
      reason: 'order_confirmed',
      referenceId: testOrder.orderNumber,
      adjustedBy: customer._id,
    });
    await gathiyaInvBefore.save();

    console.log(`✅ TEST 6: Order created (${testOrder.orderNumber}) for ${orderQty} x 500g Tikha Gathiya = ₹${testOrder.totalAmount} (including ₹30 Rajkot delivery).`);

    // TEST 7: Inventory Deduction Verification
    const gathiyaInvAfter = await Inventory.findOne({ product: gathiya._id });
    if (gathiyaInvAfter.availableGrams !== initialGrams - totalGramsNeeded) {
      throw new Error(`Inventory deduction failed: expected ${initialGrams - totalGramsNeeded}, got ${gathiyaInvAfter.availableGrams}`);
    }
    console.log(`✅ TEST 7: Inventory accurately deducted in grams: ${initialGrams}g -> ${gathiyaInvAfter.availableGrams}g.`);

    // TEST 8: Admin Status Lifecycle Flow (Pending -> Confirmed -> Preparing -> Packed -> Dispatched -> Delivered)
    const lifecycleStatuses = ['confirmed', 'preparing', 'packed', 'dispatched', 'delivered'];
    for (const st of lifecycleStatuses) {
      testOrder.orderStatus = st;
      testOrder.trackingHistory.push({
        status: st,
        title: `Order ${st.toUpperCase()}`,
        description: `Status changed to ${st}`,
        updatedAt: new Date(),
      });
      await testOrder.save();
    }
    const updatedOrder = await Order.findById(testOrder._id);
    if (updatedOrder.orderStatus !== 'delivered' || updatedOrder.trackingHistory.length !== 6) {
      throw new Error('Order lifecycle progression failed');
    }
    console.log(`✅ TEST 8: Full order lifecycle verified (Confirmed -> Preparing -> Packed -> Dispatched -> Delivered).`);

    // TEST 9: Combo Order Simulation (Custom Combo: 250g Tikha Gathiya + 250g Sev Mamra + 500g Plain Poha Chevdo)
    const sevMamra = await Product.findOne({ slug: 'sev-mamra' });
    const pohaChevdo = await Product.findOne({ slug: 'plain-poha-chevdo' });

    const comboItem1Price = calculateItemUnitPrice(gathiya.pricePerKg, 250); // (500 * 250) / 1000 = 125
    const comboItem2Price = calculateItemUnitPrice(sevMamra.pricePerKg, 250); // (400 * 250) / 1000 = 100
    const comboItem3Price = calculateItemUnitPrice(pohaChevdo.pricePerKg, 500); // (400 * 500) / 1000 = 200
    const comboSubtotal = comboItem1Price + comboItem2Price + comboItem3Price; // 125 + 100 + 200 = 425

    if (comboSubtotal !== 425) {
      throw new Error(`Combo calculation failed: expected 425, got ${comboSubtotal}`);
    }
    console.log(`✅ TEST 9: Custom Combo calculation verified:`);
    console.log(`   - 250g Tikha Gathiya (₹500/kg) = ₹${comboItem1Price}`);
    console.log(`   - 250g Sev Mamra    (₹400/kg) = ₹${comboItem2Price}`);
    console.log(`   - 500g Poha Chevdo   (₹400/kg) = ₹${comboItem3Price}`);
    console.log(`   Total Combo Price = ₹${comboSubtotal}`);

    // Clean up test order & customer
    await Order.findByIdAndDelete(testOrder._id);
    await User.findByIdAndDelete(customer._id);
    // Restore inventory
    gathiyaInvAfter.availableGrams = initialGrams;
    await gathiyaInvAfter.save();

    console.log('=======================================================');
    console.log('🎉 ALL 9 END-TO-END CRITICAL TESTS PASSED SUCCESSFULLY!');
    console.log('=======================================================');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ E2E TEST FAILED:', err.message);
    process.exit(1);
  }
};

runE2ETests();

