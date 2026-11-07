const Review = require('../models/Review');
const Order = require('../models/Order');

// @desc Get approved reviews for a product
// @route GET /api/reviews/product/:productId
exports.getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ product: productId, status: 'approved' })
      .sort({ createdAt: -1 })
      .populate('user', 'name');

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Add a review for a snack
// @route POST /api/reviews
exports.addReview = async (req, res, next) => {
  try {
    const { productId, rating, title, comment } = req.body;

    if (!productId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Product ID, rating (1-5), and review comment are required.',
      });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({ product: productId, user: req.user._id });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a review for this snack.',
      });
    }

    // Check if user actually purchased this product (Verified Purchase check)
    const hasPurchased = await Order.findOne({
      customer: req.user._id,
      'orderItems.product': productId,
      orderStatus: 'delivered',
    });

    const review = await Review.create({
      product: productId,
      user: req.user._id,
      userName: req.user.name,
      rating: Number(rating),
      title: title || '',
      comment,
      isVerifiedPurchase: Boolean(hasPurchased),
      status: 'approved', // Auto-approved or pending based on settings
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully. Thank you for your feedback!',
      review,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get all reviews (Admin)
// @route GET /api/reviews
exports.getAllReviews = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status) query.status = status;

    const reviews = await Review.find(query)
      .populate('product', 'name images')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Update review status (Admin: approve / reject)
// @route PUT /api/reviews/:id/status
exports.updateReviewStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const review = await Review.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    // Recalculate average rating
    await Review.calculateAverageRating(review.product);

    res.status(200).json({
      success: true,
      message: `Review has been ${status}`,
      review,
    });
  } catch (error) {
    next(error);
  }
};

