const express = require('express');
const router = express.Router();
const {
  createOrder,
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
const { protect, authorize } = require('../middleware/auth');

// Public tracking
router.get('/track/:orderNumber', trackOrder);

// Customer protected routes
router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/reorder/:id', protect, reorder);
router.post('/:id/cancel', protect, cancelOrder);
router.get('/:id/invoice', protect, getOrderInvoice);

// Admin protected routes
router.get('/', protect, authorize('admin'), getAllOrders);
router.get('/export/csv', protect, authorize('admin'), exportOrdersCsv);
router.put('/:id/status', protect, authorize('admin'), updateOrderStatus);

// Generic single order route (after explicit subpaths)
router.get('/:identifier', protect, getOrderById);

module.exports = router;

