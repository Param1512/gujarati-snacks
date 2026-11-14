const express = require('express');
const router = express.Router();
const {
  verifyPayment,
  handleWebhook,
} = require('../controllers/paymentController');

// Public guest & user payment verification
router.post('/verify', verifyPayment);
router.post('/webhook', handleWebhook);

module.exports = router;

