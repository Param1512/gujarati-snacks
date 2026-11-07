const Product = require('../models/Product');
const Inventory = require('../models/Inventory');
const Category = require('../models/Category');
const { calculateItemUnitPrice, validateWeightOption, getWeightLabel } = require('../services/priceCalculator');

// @desc Get all products with filters, search, sorting and pagination
// @route GET /api/products
exports.getProducts = async (req, res, next) => {
  try {
    const {
      category,
      search,
      minPrice,
      maxPrice,
      inStockOnly,
      sort,
      page = 1,
      limit = 12,
      isCombo,
      isFeatured,
      isBestseller,
    } = req.query;

    const query = { isActive: true };

    if (category) {
      // Find category by slug or ID
      const catDoc = await Category.findOne({
        $or: [{ slug: category }, { _id: category.match(/^[0-9a-fA-F]{24}$/) ? category : null }],
      });
      if (catDoc) {
        query.category = catDoc._id;
      }
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { nameGujarati: { $regex: search, $options: 'i' } },
      ];
    }

    if (minPrice || maxPrice) {
      query.pricePerKg = {};
      if (minPrice) query.pricePerKg.$gte = Number(minPrice);
      if (maxPrice) query.pricePerKg.$lte = Number(maxPrice);
    }

    if (isCombo !== undefined) {
      query.isCombo = isCombo === 'true';
    }

    if (isFeatured !== undefined) {
      query.isFeatured = isFeatured === 'true';
    }

    if (isBestseller !== undefined) {
      query.isBestseller = isBestseller === 'true';
    }

    // Sorting
    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { pricePerKg: 1 };
    else if (sort === 'price_desc') sortOption = { pricePerKg: -1 };
    else if (sort === 'rating') sortOption = { 'ratings.average': -1 };
    else if (sort === 'name_asc') sortOption = { name: 1 };
    else if (sort === 'name_desc') sortOption = { name: -1 };

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name slug nameGujarati')
      .populate('comboItems.product', 'name pricePerKg images slug')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    // Fetch inventory for each product
    const productIds = products.map((p) => p._id);
    const inventories = await Inventory.find({ product: { $in: productIds } });
    const inventoryMap = {};
    inventories.forEach((inv) => {
      inventoryMap[inv.product.toString()] = {
        availableGrams: inv.availableGrams,
        availableKg: inv.availableKg,
        inStock: inv.availableGrams > 0,
        isLowStock: inv.isLowStock,
      };
    });

    const productsWithInventory = products.map((prod) => {
      const pObj = prod.toObject({ virtuals: true });
      pObj.inventory = inventoryMap[prod._id.toString()] || {
        availableGrams: 0,
        availableKg: '0.00',
        inStock: false,
        isLowStock: true,
      };
      return pObj;
    });

    res.status(200).json({
      success: true,
      count: productsWithInventory.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      products: productsWithInventory,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get product by ID or Slug
// @route GET /api/products/:identifier
exports.getProduct = async (req, res, next) => {
  try {
    const { identifier } = req.params;
    const isObjectId = identifier.match(/^[0-9a-fA-F]{24}$/);

    const product = await Product.findOne({
      $or: isObjectId ? [{ _id: identifier }, { slug: identifier }] : [{ slug: identifier }],
    })
      .populate('category', 'name slug nameGujarati description')
      .populate('comboItems.product', 'name pricePerKg images slug');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Snack not found',
      });
    }

    const inventory = await Inventory.findOne({ product: product._id });

    // Fetch related products from same category
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isActive: true,
    })
      .limit(4)
      .select('name slug pricePerKg images ratings isBestseller weightOptions');

    const productObj = product.toObject({ virtuals: true });
    productObj.inventory = inventory
      ? {
          availableGrams: inventory.availableGrams,
          availableKg: inventory.availableKg,
          inStock: inventory.availableGrams > 0,
          isLowStock: inventory.isLowStock,
        }
      : { availableGrams: 0, availableKg: '0.00', inStock: false, isLowStock: true };

    res.status(200).json({
      success: true,
      product: productObj,
      relatedProducts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Calculate price and stock for Custom Snack Combo Builder
// @route POST /api/products/custom-combo/calculate
exports.calculateCustomCombo = async (req, res, next) => {
  try {
    const { items } = req.body;
    // Expected items: [ { productId: '...', weightGrams: 250, quantity: 1 }, ... ]

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one snack item for the combo.',
      });
    }

    let comboTotal = 0;
    let comboTotalGrams = 0;
    const validatedItems = [];

    for (const item of items) {
      const { productId, weightGrams, quantity = 1 } = item;

      if (!validateWeightOption(weightGrams)) {
        return res.status(400).json({
          success: false,
          message: `Invalid weight option: ${weightGrams}g. Allowed: 250g, 500g, 1000g, 2000g.`,
        });
      }

      const product = await Product.findById(productId);
      if (!product || !product.isActive) {
        return res.status(404).json({
          success: false,
          message: `Product with id ${productId} not found or is currently inactive.`,
        });
      }

      // Check stock
      const inventory = await Inventory.findOne({ product: productId });
      const requiredGrams = weightGrams * quantity;
      const availableGrams = inventory ? inventory.availableGrams : 0;

      if (availableGrams < requiredGrams) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Required: ${requiredGrams}g, Available: ${availableGrams}g.`,
        });
      }

      const unitPrice = calculateItemUnitPrice(product.pricePerKg, weightGrams);
      const subtotal = unitPrice * quantity;

      comboTotal += subtotal;
      comboTotalGrams += requiredGrams;

      validatedItems.push({
        product: product._id,
        name: product.name,
        pricePerKg: product.pricePerKg,
        weightGrams,
        weightLabel: getWeightLabel(weightGrams),
        unitPrice,
        quantity,
        totalGrams: requiredGrams,
        subtotal,
        imageUrl: product.images[0]?.url || '',
      });
    }

    res.status(200).json({
      success: true,
      comboSummary: {
        totalItemsCount: validatedItems.length,
        comboTotal,
        comboTotalGrams,
        comboTotalKg: (comboTotalGrams / 1000).toFixed(2),
        items: validatedItems,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Create new product (Admin)
// @route POST /api/products
exports.createProduct = async (req, res, next) => {
  try {
    const {
      name,
      nameGujarati,
      slug,
      category,
      description,
      descriptionGujarati,
      pricePerKg,
      weightOptions,
      images,
      isCombo,
      comboItems,
      isFeatured,
      isBestseller,
      isNewArrival,
      ingredients,
      allergens,
      shelfLife,
      storageInstructions,
      packagingDetails,
      preparationDate,
      bestBeforeDate,
      initialStockGrams = 10000, // 10 kg default initial stock
      lowStockThresholdGrams = 2000,
    } = req.body;

    const productSlug =
      slug ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const existingProduct = await Product.findOne({ slug: productSlug });
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: 'A snack product with this name or slug already exists',
      });
    }

    const product = await Product.create({
      name,
      nameGujarati: nameGujarati || '',
      slug: productSlug,
      category,
      description,
      descriptionGujarati: descriptionGujarati || '',
      pricePerKg: Number(pricePerKg),
      weightOptions: weightOptions || [
        { weightGrams: 250, label: '250 g', isActive: true },
        { weightGrams: 500, label: '500 g', isActive: true },
        { weightGrams: 1000, label: '1 kg', isActive: true },
        { weightGrams: 2000, label: '2 kg', isActive: true },
      ],
      images: images || [],
      isCombo: Boolean(isCombo),
      comboItems: comboItems || [],
      isFeatured: Boolean(isFeatured),
      isBestseller: Boolean(isBestseller),
      isNewArrival: Boolean(isNewArrival),
      ingredients: ingredients || [],
      allergens: allergens || [],
      shelfLife: shelfLife || '',
      storageInstructions: storageInstructions || '',
      packagingDetails: packagingDetails || '',
      preparationDate: preparationDate || undefined,
      bestBeforeDate: bestBeforeDate || undefined,
    });

    // Create corresponding Inventory record
    await Inventory.create({
      product: product._id,
      availableGrams: Number(initialStockGrams),
      lowStockThresholdGrams: Number(lowStockThresholdGrams),
      adjustmentLogs: [
        {
          adjustmentGrams: Number(initialStockGrams),
          previousGrams: 0,
          newGrams: Number(initialStockGrams),
          reason: 'initial_seed',
          adjustedBy: req.user?._id,
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully with inventory',
      product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Update product (Admin)
// @route PUT /api/products/:id
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Delete product (Admin)
// @route DELETE /api/products/:id
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Soft delete or hard delete
    await Product.findByIdAndDelete(req.params.id);
    await Inventory.findOneAndDelete({ product: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Product and associated inventory deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

