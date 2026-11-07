const express = require('express');
const router = express.Router();
const {
  submitBulkOrder,
  getAllBulkOrders,
  updateBulkOrderStatus,
} = require('../controllers/bulkOrderController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', submitBulkOrder);
router.get('/', protect, authorize('admin'), getAllBulkOrders);
router.put('/:id/status', protect, authorize('admin'), updateBulkOrderStatus);

module.exports = router;

