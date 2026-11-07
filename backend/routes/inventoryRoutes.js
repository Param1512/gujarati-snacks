const express = require('express');
const router = express.Router();
const {
  getInventoryStatus,
  updateStock,
  getStockLogs,
} = require('../controllers/inventoryController');
const { protect, authorize } = require('../middleware/auth');

// All inventory management routes are restricted to Admin
router.use(protect, authorize('admin'));

router.get('/', getInventoryStatus);
router.put('/:productId', updateStock);
router.get('/:productId/logs', getStockLogs);

module.exports = router;

