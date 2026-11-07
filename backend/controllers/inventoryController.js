const Inventory = require('../models/Inventory');
const Product = require('../models/Product');

// @desc Get all inventory statuses with low-stock alerts
// @route GET /api/inventory
exports.getInventoryStatus = async (req, res, next) => {
  try {
    const inventories = await Inventory.find()
      .populate('product', 'name slug pricePerKg images isCombo isActive')
      .sort({ availableGrams: 1 });

    const totalStockGrams = inventories.reduce((sum, item) => sum + item.availableGrams, 0);
    const lowStockCount = inventories.filter((item) => item.availableGrams <= item.lowStockThresholdGrams).length;
    const outOfStockCount = inventories.filter((item) => item.availableGrams <= 0).length;

    res.status(200).json({
      success: true,
      summary: {
        totalProducts: inventories.length,
        totalStockGrams,
        totalStockKg: (totalStockGrams / 1000).toFixed(2),
        lowStockCount,
        outOfStockCount,
      },
      inventory: inventories,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Update stock for a snack (Admin manual adjustment or restock)
// @route PUT /api/inventory/:productId
exports.updateStock = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { adjustmentGrams, newTotalGrams, reason = 'manual_restock', lowStockThresholdGrams } = req.body;

    let inventory = await Inventory.findOne({ product: productId });
    if (!inventory) {
      inventory = new Inventory({
        product: productId,
        availableGrams: 0,
        lowStockThresholdGrams: 2000,
      });
    }

    const previousGrams = inventory.availableGrams;
    let newGrams = previousGrams;
    let actualAdjustment = 0;

    if (newTotalGrams !== undefined) {
      newGrams = Number(newTotalGrams);
      actualAdjustment = newGrams - previousGrams;
    } else if (adjustmentGrams !== undefined) {
      actualAdjustment = Number(adjustmentGrams);
      newGrams = previousGrams + actualAdjustment;
    }

    if (newGrams < 0) {
      return res.status(400).json({
        success: false,
        message: 'Stock in grams cannot be negative',
      });
    }

    inventory.availableGrams = newGrams;
    if (lowStockThresholdGrams !== undefined) {
      inventory.lowStockThresholdGrams = Number(lowStockThresholdGrams);
    }

    inventory.adjustmentLogs.push({
      adjustmentGrams: actualAdjustment,
      previousGrams,
      newGrams,
      reason,
      adjustedBy: req.user._id,
      createdAt: new Date(),
    });

    await inventory.save();

    res.status(200).json({
      success: true,
      message: 'Snack inventory updated successfully',
      inventory,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get stock adjustment audit trail for a product
// @route GET /api/inventory/:productId/logs
exports.getStockLogs = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const inventory = await Inventory.findOne({ product: productId }).populate('adjustmentLogs.adjustedBy', 'name email');

    if (!inventory) {
      return res.status(404).json({ success: false, message: 'Inventory record not found' });
    }

    res.status(200).json({
      success: true,
      logs: inventory.adjustmentLogs.reverse(),
    });
  } catch (error) {
    next(error);
  }
};

