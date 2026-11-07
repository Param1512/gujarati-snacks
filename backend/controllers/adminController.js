const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Inventory = require('../models/Inventory');

// @desc Get comprehensive Admin Dashboard Analytics
// @route GET /api/admin/analytics
exports.getAnalytics = async (req, res, next) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    // 1. Total, Today, Monthly Revenue
    const revenueStats = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'cancelled' } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          totalOrders: { $sum: 1 },
        },
      },
    ]);

    const todayRevenueStats = await Order.aggregate([
      {
        $match: {
          orderStatus: { $ne: 'cancelled' },
          createdAt: { $gte: todayStart },
        },
      },
      {
        $group: {
          _id: null,
          todayRevenue: { $sum: '$totalAmount' },
          todayOrders: { $sum: 1 },
        },
      },
    ]);

    const monthRevenueStats = await Order.aggregate([
      {
        $match: {
          orderStatus: { $ne: 'cancelled' },
          createdAt: { $gte: monthStart },
        },
      },
      {
        $group: {
          _id: null,
          monthlyRevenue: { $sum: '$totalAmount' },
          monthlyOrders: { $sum: 1 },
        },
      },
    ]);

    // 2. Orders by Status
    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: '$orderStatus',
          count: { $sum: 1 },
        },
      },
    ]);

    const statusMap = {
      pending: 0,
      confirmed: 0,
      preparing: 0,
      packed: 0,
      dispatched: 0,
      delivered: 0,
      cancelled: 0,
    };
    ordersByStatus.forEach((s) => {
      statusMap[s._id] = s.count;
    });

    // 3. Customer & Product counts
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalProducts = await Product.countDocuments({ isActive: true });

    // 4. Low stock products (from Inventory)
    const lowStockInventories = await Inventory.find({
      $expr: { $lte: ['$availableGrams', '$lowStockThresholdGrams'] },
    })
      .populate('product', 'name pricePerKg images')
      .limit(6);

    // 5. Bestselling snacks (by frequency in orders)
    const bestsellers = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'cancelled' } } },
      { $unwind: '$orderItems' },
      {
        $group: {
          _id: '$orderItems.product',
          name: { $first: '$orderItems.name' },
          totalQuantitySold: { $sum: '$orderItems.quantity' },
          totalWeightSoldGrams: { $sum: '$orderItems.totalGrams' },
          totalRevenue: { $sum: '$orderItems.itemSubtotal' },
        },
      },
      { $sort: { totalQuantitySold: -1 } },
      { $limit: 5 },
    ]);

    // 6. Recent Orders
    const recentOrders = await Order.find()
      .populate('customer', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(6);

    res.status(200).json({
      success: true,
      data: {
        totalRevenue: revenueStats[0]?.totalRevenue || 0,
        todayRevenue: todayRevenueStats[0]?.todayRevenue || 0,
        monthlyRevenue: monthRevenueStats[0]?.monthlyRevenue || 0,
        totalOrders: revenueStats[0]?.totalOrders || 0,
        pendingOrders: statusMap.pending || 0,
        deliveredOrders: statusMap.delivered || 0,
        cancelledOrders: statusMap.cancelled || 0,
        preparingOrders: statusMap.preparing || 0,
        packedOrders: statusMap.packed || 0,
        dispatchedOrders: statusMap.dispatched || 0,
        totalCustomers,
        totalProducts,
        statusCounts: statusMap,
        bestsellers,
        lowStockProducts: lowStockInventories,
        recentOrders,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get Customers List with order count and total spend
// @route GET /api/admin/customers
exports.getCustomers = async (req, res, next) => {
  try {
    const customers = await User.find({ role: 'customer' }).sort({ createdAt: -1 });

    const customerStats = await Promise.all(
      customers.map(async (cust) => {
        const orders = await Order.find({ customer: cust._id, orderStatus: { $ne: 'cancelled' } });
        const totalSpent = orders.reduce((sum, o) => sum + o.totalAmount, 0);
        return {
          id: cust._id,
          name: cust.name,
          email: cust.email,
          phone: cust.phone,
          isActive: cust.isActive,
          createdAt: cust.createdAt,
          ordersCount: orders.length,
          totalSpent,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: customerStats.length,
      customers: customerStats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Toggle customer status (active/deactive)
// @route PUT /api/admin/customers/:id/status
exports.toggleCustomerStatus = async (req, res, next) => {
  try {
    const customer = await User.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    customer.isActive = !customer.isActive;
    await customer.save();

    res.status(200).json({
      success: true,
      message: `Customer account is now ${customer.isActive ? 'Active' : 'Deactivated'}`,
      customer,
    });
  } catch (error) {
    next(error);
  }
};

