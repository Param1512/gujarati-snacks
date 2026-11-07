const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  calculateCustomCombo,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getProducts);
router.post('/custom-combo/calculate', calculateCustomCombo);
router.get('/:identifier', getProduct);

// Protected Admin Routes
router.post('/', protect, authorize('admin'), createProduct);
router.put('/:id', protect, authorize('admin'), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

module.exports = router;

