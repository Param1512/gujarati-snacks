const Wishlist = require('../models/Wishlist');

// @desc Get user's wishlist
// @route GET /api/wishlist
exports.getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate({
      path: 'products',
      populate: { path: 'category', select: 'name slug' },
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    res.status(200).json({
      success: true,
      count: wishlist.products.length,
      products: wishlist.products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Add snack to wishlist
// @route POST /api/wishlist/:productId
exports.addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;
    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user._id, products: [] });
    }

    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
      await wishlist.save();
    }

    res.status(200).json({
      success: true,
      message: 'Snack added to wishlist',
      products: wishlist.products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Remove snack from wishlist
// @route DELETE /api/wishlist/:productId
exports.removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;
    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (wishlist) {
      wishlist.products = wishlist.products.filter((id) => id.toString() !== productId);
      await wishlist.save();
    }

    res.status(200).json({
      success: true,
      message: 'Snack removed from wishlist',
      products: wishlist ? wishlist.products : [],
    });
  } catch (error) {
    next(error);
  }
};

