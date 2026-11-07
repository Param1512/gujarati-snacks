const express = require('express');
const router = express.Router();
const {
  getProductReviews,
  addReview,
  getAllReviews,
  updateReviewStatus,
} = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/auth');

router.get('/product/:productId', getProductReviews);
router.post('/', protect, addReview);

// Admin review moderation
router.get('/', protect, authorize('admin'), getAllReviews);
router.put('/:id/status', protect, authorize('admin'), updateReviewStatus);

module.exports = router;

