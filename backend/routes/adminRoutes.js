const express = require('express');
const router = express.Router();
const {
  getAnalytics,
  getCustomers,
  toggleCustomerStatus,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

router.get('/analytics', getAnalytics);
router.get('/customers', getCustomers);
router.put('/customers/:id/status', toggleCustomerStatus);

module.exports = router;

