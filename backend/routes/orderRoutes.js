const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrderConfirmationDetails,
  getMyOrders,
  getOrderById,
  trackOrder,
  cancelOrder,
  reorder,
  updateOrderStatus,
  getAllOrders,
  getOrderInvoice,
  exportOrdersCsv,
} = require('../controllers/orderController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');

// Public tracking and confirmation routes
router.get('/track/:orderNumber', trackOrder);
router.get('/confirmed/:orderNumber', getOrderConfirmationDetails);

// Guest checkout + customer/admin order placement
router.post('/', optionalAuth, createOrder);

// Customer / Admin order routes
router.get('/my-orders', protect, getMyOrders);
router.get('/reorder/:id', optionalAuth, reorder);
router.post('/:id/cancel', optionalAuth, cancelOrder);
router.get('/:id/invoice', optionalAuth, getOrderInvoice);

// Admin protected routes
router.get('/', protect, authorize('admin'), getAllOrders);
router.get('/export/csv', protect, authorize('admin'), exportOrdersCsv);
router.put('/:id/status', protect, authorize('admin'), updateOrderStatus);

// Single order route (supports both admin and guest verification)
router.get('/:identifier', optionalAuth, getOrderById);

module.exports = router;

