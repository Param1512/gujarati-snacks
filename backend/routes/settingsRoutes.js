const express = require('express');
const router = express.Router();
const {
  getSettings,
  updateSettings,
  checkPincode,
} = require('../controllers/businessSettingsController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getSettings);
router.get('/check-pincode/:pincode', checkPincode);
router.put('/', protect, authorize('admin'), updateSettings);

module.exports = router;

