const Order = require('../models/Order');
const Product = require('../models/Product');
const Inventory = require('../models/Inventory');
const Coupon = require('../models/Coupon');
const BusinessSettings = require('../models/BusinessSettings');
const Payment = require('../models/Payment');
const { calculateItemUnitPrice, validateWeightOption, getWeightLabel } = require('../services/priceCalculator');
const { createRazorpayOrder } = require('../services/razorpayService');
const { generateInvoiceHtml } = require('../services/invoiceService');

// Helper to generate unique order number: GNS-YYYYMMDD-XXXX
const generateOrderNumber = () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomStr = Math.floor(1000 + Math.random() * 9000);
  return `GNS-${dateStr}-${randomStr}`;
};

// @desc Create new order (with full server-side price & inventory validation)
// @route POST /api/orders
exports.createOrder = async (req, res, next) => {
  try {
    const {
      items, // [ { productId, weightGrams, quantity } ]
      shippingAddress,
      deliveryType = 'local_rajkot',
      paymentMethod = 'cod',
      couponCode,
      customerNotes = '',
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one snack item',
      });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.addressLine1 || !shippingAddress.pincode) {
      return res.status(400).json({
        success: false,
        message: 'Please provide complete delivery address details',
      });
    }

    const settings = (await BusinessSettings.findOne()) || {
      deliveryCharges: { localRajkot: 30, standardShipping: 70, customerPickup: 0 },
      freeDeliveryThreshold: 999,
      allowCashOnDelivery: true,
      operatingStatus: 'open',
    };

    if (settings.operatingStatus === 'closed') {
      return res.status(400).json({
        success: false,
        message: 'We are currently not accepting new orders. Please check back soon.',
      });
    }

    if (paymentMethod === 'cod' && !settings.allowCashOnDelivery) {
      return res.status(400).json({
        success: false,
        message: 'Cash on Delivery is currently disabled. Please select online payment.',
      });
    }

    // 1. Validate each item, calculate backend unit price, check inventory
    let itemsSubtotal = 0;
    let totalWeightGrams = 0;
    const validatedOrderItems = [];
    const inventoryUpdates = [];

    for (const item of items) {
      const { productId, weightGrams, quantity = 1 } = item;

      if (!validateWeightOption(weightGrams)) {
        return res.status(400).json({
          success: false,
          message: `Invalid weight option (${weightGrams}g). Allowed options are 250g, 500g, 1kg, 2kg.`,
        });
      }

      if (quantity < 1) {
        return res.status(400).json({
          success: false,
          message: 'Quantity must be at least 1.',
        });
      }

      const product = await Product.findById(productId);
      if (!product || !product.isActive) {
        return res.status(404).json({
          success: false,
          message: `Product ${productId} is not available.`,
        });
      }

      const requiredGrams = weightGrams * quantity;

      // Check stock in Inventory collection
      const inventory = await Inventory.findOne({ product: productId });
      if (!inventory || inventory.availableGrams < requiredGrams) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Required: ${requiredGrams}g, Available: ${inventory ? inventory.availableGrams : 0}g.`,
        });
      }

      // Exact server-side dynamic price
      const calculatedUnitPrice = calculateItemUnitPrice(product.pricePerKg, weightGrams);
      const itemSubtotal = calculatedUnitPrice * quantity;

      itemsSubtotal += itemSubtotal;
      totalWeightGrams += requiredGrams;

      validatedOrderItems.push({
        product: product._id,
        name: product.name,
        pricePerKg: product.pricePerKg,
        weightGrams,
        weightLabel: getWeightLabel(weightGrams),
        calculatedUnitPrice,
        quantity,
        totalGrams: requiredGrams,
        itemSubtotal,
        imageUrl: product.images[0]?.url || '',
        isCombo: product.isCombo,
      });

      inventoryUpdates.push({
        inventory,
        requiredGrams,
        productName: product.name,
      });
    }

    // 2. Validate & calculate delivery fee
    let deliveryFee = 0;
    if (deliveryType === 'customer_pickup') {
      deliveryFee = 0;
    } else if (itemsSubtotal >= settings.freeDeliveryThreshold) {
      deliveryFee = 0;
    } else {
      deliveryFee = deliveryType === 'standard_shipping' ? settings.deliveryCharges.standardShipping : settings.deliveryCharges.localRajkot;
    }

    // 3. Validate coupon if provided
    let discountAmount = 0;
    let appliedCouponData = null;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.trim().toUpperCase() });
      if (coupon) {
        const validation = coupon.isValid(itemsSubtotal);
        if (validation.valid) {
          discountAmount = coupon.calculateDiscount(itemsSubtotal);
          appliedCouponData = {
            code: coupon.code,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
          };
          coupon.usedCount += 1;
          await coupon.save();
        }
      }
    }

    const totalAmount = Math.max(0, itemsSubtotal + deliveryFee - discountAmount);
    const orderNumber = generateOrderNumber();

    // 4. Create Order
    const order = await Order.create({
      orderNumber,
      customer: req.user._id,
      orderItems: validatedOrderItems,
      shippingAddress,
      deliveryType,
      itemsSubtotal,
      deliveryFee,
      discountAmount,
      appliedCoupon: appliedCouponData,
      totalAmount,
      totalWeightGrams,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
      orderStatus: 'pending',
      trackingHistory: [
        {
          status: 'pending',
          title: 'Order Placed',
          description: `Your order #${orderNumber} has been received and is awaiting confirmation.`,
          updatedAt: new Date(),
        },
      ],
      customerNotes,
    });

    // 5. Deduct inventory stock & record adjustment logs
    for (const update of inventoryUpdates) {
      const { inventory, requiredGrams } = update;
      const prev = inventory.availableGrams;
      inventory.availableGrams = Math.max(0, inventory.availableGrams - requiredGrams);
      inventory.adjustmentLogs.push({
        adjustmentGrams: -requiredGrams,
        previousGrams: prev,
        newGrams: inventory.availableGrams,
        reason: 'order_confirmed',
        referenceId: order.orderNumber,
        adjustedBy: req.user._id,
        createdAt: new Date(),
      });
      await inventory.save();
    }

    // 6. Handle Razorpay initiation if online payment
    let razorpayOrderData = null;
    if (paymentMethod === 'razorpay') {
      try {
        const rzpOrder = await createRazorpayOrder(totalAmount, order.orderNumber, {
          orderNumber: order.orderNumber,
          customerEmail: req.user.email,
        });

        order.paymentDetails = {
          razorpayOrderId: rzpOrder.id,
        };
        await order.save();

        await Payment.create({
          order: order._id,
          user: req.user._id,
          paymentMethod: 'razorpay',
          amount: totalAmount,
          currency: 'INR',
          razorpayOrderId: rzpOrder.id,
          status: 'created',
        });

        razorpayOrderData = {
          orderId: rzpOrder.id,
          amount: rzpOrder.amount,
          currency: rzpOrder.currency,
          keyId: process.env.RAZORPAY_KEY_ID,
        };
      } catch (err) {
        console.error('Failed to initiate Razorpay order:', err);
      }
    } else {
      // COD payment record
      await Payment.create({
        order: order._id,
        user: req.user._id,
        paymentMethod: 'cod',
        amount: totalAmount,
        currency: 'INR',
        status: 'created',
      });
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order,
      razorpayOrder: razorpayOrderData,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get logged-in user orders
// @route GET /api/orders/my-orders
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .populate('orderItems.product', 'name images slug pricePerKg')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get single order by ID or orderNumber
// @route GET /api/orders/:identifier
exports.getOrderById = async (req, res, next) => {
  try {
    const { identifier } = req.params;
    const isObjectId = identifier.match(/^[0-9a-fA-F]{24}$/);

    const order = await Order.findOne({
      $or: isObjectId ? [{ _id: identifier }, { orderNumber: identifier }] : [{ orderNumber: identifier }],
    })
      .populate('customer', 'name email phone')
      .populate('orderItems.product', 'name slug images');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Role check: Admin can view any order; Customer can only view their own
    if (req.user.role !== 'admin' && order.customer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You cannot view other customers orders.',
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Public order tracking by orderNumber and phone
// @route GET /api/orders/track/:orderNumber
exports.trackOrder = async (req, res, next) => {
  try {
    const { orderNumber } = req.params;
    const { phone } = req.query;

    const query = { orderNumber: orderNumber.trim() };
    if (phone) {
      query['shippingAddress.phone'] = { $regex: phone.slice(-10) };
    }

    const order = await Order.findOne(query).select(
      'orderNumber orderStatus trackingHistory shippingAddress.city deliveryType createdAt totalAmount orderItems.name orderItems.weightLabel orderItems.quantity'
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found. Please verify the Order Number and Phone number.',
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Cancel order & restore inventory stock
// @route POST /api/orders/:id/cancel
exports.cancelOrder = async (req, res, next) => {
  try {
    const { reason = 'Cancelled by user' } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (req.user.role !== 'admin' && order.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this order' });
    }

    if (['dispatched', 'delivered', 'cancelled'].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel an order that is already ${order.orderStatus}.`,
      });
    }

    order.orderStatus = 'cancelled';
    order.cancellationReason = reason;
    order.trackingHistory.push({
      status: 'cancelled',
      title: 'Order Cancelled',
      description: `Order cancelled. Reason: ${reason}`,
      updatedAt: new Date(),
    });
    await order.save();

    // Restore inventory in grams
    for (const item of order.orderItems) {
      const inventory = await Inventory.findOne({ product: item.product });
      if (inventory) {
        const prev = inventory.availableGrams;
        inventory.availableGrams += item.totalGrams;
        inventory.adjustmentLogs.push({
          adjustmentGrams: item.totalGrams,
          previousGrams: prev,
          newGrams: inventory.availableGrams,
          reason: 'order_cancelled_restored',
          referenceId: order.orderNumber,
          adjustedBy: req.user._id,
          createdAt: new Date(),
        });
        await inventory.save();
      }
    }

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully and snack inventory has been restored.',
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Reorder: get payload of previous order items to add to cart
// @route GET /api/orders/:id/reorder
exports.reorder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Previous order not found' });
    }

    if (req.user.role !== 'admin' && order.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    // Check current availability of products
    const reorderItems = [];
    for (const item of order.orderItems) {
      const product = await Product.findById(item.product);
      if (product && product.isActive) {
        const currentUnitPrice = calculateItemUnitPrice(product.pricePerKg, item.weightGrams);
        reorderItems.push({
          product: product._id,
          name: product.name,
          slug: product.slug,
          pricePerKg: product.pricePerKg,
          weightGrams: item.weightGrams,
          weightLabel: item.weightLabel,
          unitPrice: currentUnitPrice,
          quantity: item.quantity,
          imageUrl: product.images[0]?.url || item.imageUrl,
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Reorder payload prepared',
      items: reorderItems,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Update Order Status (Admin: confirmed, preparing, packed, dispatched, delivered, cancelled)
// @route PUT /api/orders/:id/status
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status, adminNotes, paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const statusDescriptions = {
      confirmed: 'Order has been confirmed by Gujarati Nasta & Snacks team.',
      preparing: 'Fresh snacks are being prepared and kitchen quality checks are in progress.',
      packed: 'Snacks have been vacuum sealed and packed in hygienic food-grade pouches.',
      dispatched: 'Parcel has been dispatched via local courier / delivery executive.',
      delivered: 'Order has been safely delivered to customer.',
      cancelled: 'Order was cancelled.',
    };

    if (status && status !== order.orderStatus) {
      order.orderStatus = status;
      order.trackingHistory.push({
        status,
        title: `Status: ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        description: statusDescriptions[status] || `Order status updated to ${status}`,
        updatedAt: new Date(),
      });
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    if (adminNotes !== undefined) {
      order.adminNotes = adminNotes;
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: `Order status successfully updated to ${status}`,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get all orders with search, filter, pagination (Admin)
// @route GET /api/orders
exports.getAllOrders = async (req, res, next) => {
  try {
    const { search, status, paymentStatus, page = 1, limit = 15 } = req.query;

    const query = {};

    if (status) {
      query.orderStatus = status;
    }

    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'shippingAddress.fullName': { $regex: search, $options: 'i' } },
        { 'shippingAddress.phone': { $regex: search, $options: 'i' } },
        { 'shippingAddress.city': { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('customer', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Generate Printable Invoice HTML
// @route GET /api/orders/:id/invoice
exports.getOrderInvoice = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('customer', 'name email phone');
    if (!order) {
      return res.status(404).send('Order not found');
    }

    if (req.user.role !== 'admin' && order.customer._id.toString() !== req.user._id.toString()) {
      return res.status(403).send('Not authorized');
    }

    const settings = await BusinessSettings.findOne();
    const invoiceHtml = generateInvoiceHtml(order, settings);

    res.setHeader('Content-Type', 'text/html');
    res.send(invoiceHtml);
  } catch (error) {
    next(error);
  }
};

// @desc Export orders as CSV (Admin)
// @route GET /api/orders/export/csv
exports.exportOrdersCsv = async (req, res, next) => {
  try {
    const orders = await Order.find().populate('customer', 'name email phone').sort({ createdAt: -1 });

    const headers = [
      'Order Number',
      'Date',
      'Customer Name',
      'Phone',
      'City',
      'Pincode',
      'Items Count',
      'Total Weight (g)',
      'Subtotal',
      'Delivery Fee',
      'Discount',
      'Grand Total',
      'Payment Method',
      'Payment Status',
      'Order Status',
    ];

    const rows = orders.map((o) => [
      `"${o.orderNumber}"`,
      `"${new Date(o.createdAt).toISOString().slice(0, 10)}"`,
      `"${o.shippingAddress?.fullName || o.customer?.name || ''}"`,
      `"${o.shippingAddress?.phone || ''}"`,
      `"${o.shippingAddress?.city || ''}"`,
      `"${o.shippingAddress?.pincode || ''}"`,
      o.orderItems.length,
      o.totalWeightGrams,
      o.itemsSubtotal,
      o.deliveryFee,
      o.discountAmount,
      o.totalAmount,
      o.paymentMethod,
      o.paymentStatus,
      o.orderStatus,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=gujarati_snacks_orders.csv');
    res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};

