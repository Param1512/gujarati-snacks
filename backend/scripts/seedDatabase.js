const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Inventory = require('../models/Inventory');
const BusinessSettings = require('../models/BusinessSettings');
const Banner = require('../models/Banner');
const Coupon = require('../models/Coupon');

const seedCategories = [
  {
    name: 'Gathiya & Sev',
    nameGujarati: 'ગાંઠીયા અને સેવ',
    slug: 'gathiya-sev',
    description: 'Crispy, melt-in-mouth Kathiyawadi besan delicacies prepared with pure groundnut oil and authentic spices.',
    imageUrl: '/images/snacks/tikha-gathiya.jpg',
    displayOrder: 1,
  },
  {
    name: 'Chevdo & Chivda',
    nameGujarati: 'ચેવડો અને ચીવડા',
    slug: 'chevdo-chivda',
    description: 'Light, crunchy poha and mamra mixtures flavored with mild sweetness, turmeric, roasted peanuts and curry leaves.',
    imageUrl: '/images/snacks/plain-poha-chevdo.jpg',
    displayOrder: 2,
  },
  {
    name: 'Farsan & Puri',
    nameGujarati: 'ફરસાણ અને પૂરી',
    slug: 'farsan-puri',
    description: 'Traditional Gujarati crispy fried treats, spiced puris and crunchy spiraled snacks perfect for evening tea.',
    imageUrl: '/images/snacks/chakdi.jpg',
    displayOrder: 3,
  },
  {
    name: 'Namkeen & Daliya',
    nameGujarati: 'નમકીન અને દાળીયા',
    slug: 'namkeen-daliya',
    description: 'Savory roasted grains, crunchy spiced sing daliya, and zesty munchies hand-crafted for teatime.',
    imageUrl: '/images/snacks/masala-sing-daliya.jpg',
    displayOrder: 4,
  },
  {
    name: 'Special Snack Combos',
    nameGujarati: 'સ્પેશિયલ નાસ્તા કોમ્બો',
    slug: 'snack-combos',
    description: 'Curated combinations of authentic Gujarati homemade snacks packed fresh together at special value prices.',
    imageUrl: '/images/snacks/tea-time-combo.jpg',
    displayOrder: 5,
  },
];

// The 10 mandatory business products with strict pricing
const initialSnacks = [
  {
    name: 'Tikha Gathiya',
    nameGujarati: 'તીખા ગાંઠીયા',
    slug: 'tikha-gathiya',
    categorySlug: 'gathiya-sev',
    pricePerKg: 500, // ₹500/kg
    description: 'Spicy, golden, crispy Gujarati besan strips prepared with freshly ground black pepper (mari), ajwain, and pure groundnut oil. A signature Kathiyawadi teatime companion.',
    isBestseller: true,
    isFeatured: true,
    images: [
      {
        url: '/images/snacks/tikha-gathiya.jpg',
        alt: 'Freshly fried authentic Kathiyawadi Tikha Gathiya',
        isPrimary: true,
      },
    ],
    storageInstructions: 'Store in an airtight container in a cool, dry place. Keep away from moisture.',
    shelfLife: '60 days from packaging',
  },
  {
    name: 'Plain Poha Chevdo',
    nameGujarati: 'પ્લેન પૌઆ ચેવડો',
    slug: 'plain-poha-chevdo',
    categorySlug: 'chevdo-chivda',
    pricePerKg: 400, // ₹400/kg
    description: 'Crisp roasted thin beaten rice (poha) tossed with crunchy peanuts, dry raisins, roasted sesame, turmeric and delicate mild seasoning. Light and non-greasy.',
    isBestseller: true,
    isFeatured: true,
    images: [
      {
        url: '/images/snacks/plain-poha-chevdo.jpg',
        alt: 'Golden roasted Plain Poha Chevdo',
        isPrimary: true,
      },
    ],
    storageInstructions: 'Store in an airtight container to preserve crispness.',
    shelfLife: '60 days from packaging',
  },
  {
    name: 'Chakdi',
    nameGujarati: 'ચકડી (ચકરી)',
    slug: 'chakdi',
    categorySlug: 'farsan-puri',
    pricePerKg: 500, // ₹500/kg
    description: 'Spiraled, extra-crunchy Gujarati savory chakli made from traditional roasted grain flour spiced with cumin, sesame seeds, and green chili paste.',
    isBestseller: false,
    isFeatured: true,
    images: [
      {
        url: '/images/snacks/chakdi.jpg',
        alt: 'Crispy handmade Gujarati Chakdi',
        isPrimary: true,
      },
    ],
    storageInstructions: 'Keep in an airtight container at room temperature.',
    shelfLife: '45 days from packaging',
  },
  {
    name: 'Jhaal Mudi',
    nameGujarati: 'ઝાલ મૂડી',
    slug: 'jhaal-mudi',
    categorySlug: 'chevdo-chivda',
    pricePerKg: 500, // ₹500/kg
    description: 'Zesty, spicy puffed rice mixture seasoned with roasted spices, crunchy peanuts, sev, and signature homemade masala blend for an instant teatime boost.',
    isBestseller: false,
    isFeatured: false,
    images: [
      {
        url: '/images/snacks/jhaal-mudi.jpg',
        alt: 'Spicy seasoned Jhaal Mudi',
        isPrimary: true,
      },
    ],
    storageInstructions: 'Reseal pouch immediately after opening to keep puffed rice crispy.',
    shelfLife: '60 days from packaging',
  },
  {
    name: 'Masala Sing Daliya',
    nameGujarati: 'મસાલા સીંગ દાળીયા',
    slug: 'masala-sing-daliya',
    categorySlug: 'namkeen-daliya',
    pricePerKg: 400, // ₹400/kg
    description: 'Roasted crunchy peanuts (sing) and split roasted gram (daliya) coated with tangy Kathiyawadi dry spices, hing, amchur, and rock salt.',
    isBestseller: true,
    isFeatured: true,
    images: [
      {
        url: '/images/snacks/masala-sing-daliya.jpg',
        alt: 'Crunchy Masala Sing Daliya',
        isPrimary: true,
      },
    ],
    storageInstructions: 'Store in a dry container away from direct sunlight.',
    shelfLife: '90 days from packaging',
  },
  {
    name: 'Nimkin',
    nameGujarati: 'નમકીન (તીખા નમકીન પારે)',
    slug: 'nimkin',
    categorySlug: 'farsan-puri',
    pricePerKg: 500, // ₹500/kg
    description: 'Crispy diamond-cut savory flour bites seasoned with carom seeds (ajwain), black pepper and pink salt. Golden fried to flaky perfection.',
    isBestseller: false,
    isFeatured: false,
    images: [
      {
        url: '/images/snacks/nimkin.jpg',
        alt: 'Flaky diamond cut Nimkin',
        isPrimary: true,
      },
    ],
    storageInstructions: 'Store in an airtight tin or food-grade container.',
    shelfLife: '60 days from packaging',
  },
  {
    name: 'Sev Mamra',
    nameGujarati: 'સેવ મમરા',
    slug: 'sev-mamra',
    categorySlug: 'chevdo-chivda',
    pricePerKg: 400, // ₹400/kg
    description: 'The staple Gujarati evening snack! Crisp puffed rice (mamra) gently roasted in sing-tel with turmeric, hing, and tossed with fine besan sev.',
    isBestseller: true,
    isFeatured: true,
    images: [
      {
        url: '/images/snacks/sev-mamra.jpg',
        alt: 'Classic Gujarati Sev Mamra',
        isPrimary: true,
      },
    ],
    storageInstructions: 'Keep tightly sealed to maintain crisp texture.',
    shelfLife: '60 days from packaging',
  },
  {
    name: 'Sev',
    nameGujarati: 'સેવ (ઝીણી / નાયલોન સેવ)',
    slug: 'sev',
    categorySlug: 'gathiya-sev',
    pricePerKg: 400, // ₹400/kg
    description: 'Classic crunchy, golden thin gram flour sev prepared with pure gram flour (besan) and mild spices. Perfect for topping chaat or enjoying on its own.',
    isBestseller: true,
    isFeatured: false,
    images: [
      {
        url: '/images/snacks/sev.jpg',
        alt: 'Golden crispy Gujarati Sev',
        isPrimary: true,
      },
    ],
    storageInstructions: 'Store in an airtight container.',
    shelfLife: '60 days from packaging',
  },
  {
    name: 'Methi Chatpati',
    nameGujarati: 'મેથી ચટપટી',
    slug: 'methi-chatpati',
    categorySlug: 'farsan-puri',
    pricePerKg: 500, // ₹500/kg
    description: 'Tangy, slightly bitter-sweet crunchy savory snack infused with real dried fenugreek leaves (kasuri methi), black salt and chaat masala.',
    isBestseller: false,
    isFeatured: true,
    images: [
      {
        url: '/images/snacks/methi-chatpati.jpg',
        alt: 'Aromatic Methi Chatpati snack',
        isPrimary: true,
      },
    ],
    storageInstructions: 'Store in an airtight container.',
    shelfLife: '60 days from packaging',
  },
  {
    name: 'Maida Puri',
    nameGujarati: 'મેંદા પૂરી (ફરસી પૂરી)',
    slug: 'maida-puri',
    categorySlug: 'farsan-puri',
    pricePerKg: 500, // ₹500/kg
    description: 'Flaky, layered Kathiyawadi farsi puri made from refined flour, clarified oil (moyen), cracked black pepper and cumin. Melts in mouth with hot masala chai.',
    isBestseller: true,
    isFeatured: true,
    images: [
      {
        url: '/images/snacks/maida-puri.jpg',
        alt: 'Crispy layered Maida Farsi Puri',
        isPrimary: true,
      },
    ],
    storageInstructions: 'Store in a dry tin away from humidity.',
    shelfLife: '45 days from packaging',
  },
];

const seedDatabase = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gujarati_store';
    await mongoose.connect(mongoURI);
    console.log('[Seed] Connected to MongoDB at:', mongoURI);

    // 1. Seed Categories
    const categoryMap = {};
    for (const catData of seedCategories) {
      let category = await Category.findOne({ slug: catData.slug });
      if (!category) {
        category = await Category.create(catData);
        console.log(`[Seed] Created Category: ${category.name}`);
      } else {
        category.imageUrl = catData.imageUrl;
        await category.save();
        console.log(`[Seed] Category updated with image: ${category.name}`);
      }
      categoryMap[catData.slug] = category._id;
    }

    // Standard 4 weight options required by spec
    const standardWeights = [
      { weightGrams: 250, label: '250 g', isActive: true },
      { weightGrams: 500, label: '500 g', isActive: true },
      { weightGrams: 1000, label: '1 kg', isActive: true },
      { weightGrams: 2000, label: '2 kg', isActive: true },
    ];

    // 2. Seed 10 Snack Products
    const createdProductDocs = {};
    for (const snack of initialSnacks) {
      const categoryId = categoryMap[snack.categorySlug];
      let product = await Product.findOne({ slug: snack.slug });

      if (!product) {
        product = await Product.create({
          name: snack.name,
          nameGujarati: snack.nameGujarati,
          slug: snack.slug,
          category: categoryId,
          pricePerKg: snack.pricePerKg,
          description: snack.description,
          weightOptions: standardWeights,
          images: snack.images,
          isFeatured: snack.isFeatured,
          isBestseller: snack.isBestseller,
          isNewArrival: true,
          isActive: true,
          storageInstructions: snack.storageInstructions,
          shelfLife: snack.shelfLife,
          // Leave unverified fields empty as instructed
          ingredients: [],
          allergens: [],
          packagingDetails: 'Food-grade moisture-proof zip-lock pouch',
        });
        console.log(`[Seed] Created Snack: ${product.name} (₹${product.pricePerKg}/kg)`);
      } else {
        // Update price and images to guarantee exact specification
        product.pricePerKg = snack.pricePerKg;
        product.weightOptions = standardWeights;
        product.images = snack.images;
        await product.save();
        console.log(`[Seed] Snack updated with verified price & images: ${product.name} (₹${product.pricePerKg}/kg)`);
      }

      createdProductDocs[snack.slug] = product;

      // Seed / update Inventory for this snack: 15,000 grams (15 kg)
      let inventory = await Inventory.findOne({ product: product._id });
      if (!inventory) {
        await Inventory.create({
          product: product._id,
          availableGrams: 15000,
          lowStockThresholdGrams: 2000,
          adjustmentLogs: [
            {
              adjustmentGrams: 15000,
              previousGrams: 0,
              newGrams: 15000,
              reason: 'initial_seed',
            },
          ],
        });
        console.log(`[Seed] Created Inventory for ${product.name}: 15,000g (15 kg)`);
      }
    }

    // 3. Seed an authentic Snack Combo product using the created items
    const comboSlug = 'kathiyawadi-tea-time-combo';
    let comboProduct = await Product.findOne({ slug: comboSlug });
    if (!comboProduct && createdProductDocs['tikha-gathiya'] && createdProductDocs['plain-poha-chevdo'] && createdProductDocs['sev-mamra']) {
      const comboCatId = categoryMap['snack-combos'];
      comboProduct = await Product.create({
        name: 'Kathiyawadi Evening Tea Combo',
        nameGujarati: 'કાઠીયાવાડી સાંજની ચા કોમ્બો',
        slug: comboSlug,
        category: comboCatId,
        pricePerKg: 460, // Combined weighted average
        description: 'The ultimate Gujarati snack hamper featuring Tikha Gathiya (250g), Plain Poha Chevdo (500g), and crunchy Sev Mamra (250g). Handcrafted fresh daily in Rajkot.',
        isCombo: true,
        comboItems: [
          {
            product: createdProductDocs['tikha-gathiya']._id,
            name: 'Tikha Gathiya',
            weightGrams: 250,
            weightLabel: '250 g',
            pricePerKg: 500,
          },
          {
            product: createdProductDocs['plain-poha-chevdo']._id,
            name: 'Plain Poha Chevdo',
            weightGrams: 500,
            weightLabel: '500 g',
            pricePerKg: 400,
          },
          {
            product: createdProductDocs['sev-mamra']._id,
            name: 'Sev Mamra',
            weightGrams: 250,
            weightLabel: '250 g',
            pricePerKg: 400,
          },
        ],
        weightOptions: [
          { weightGrams: 1000, label: '1 kg Box (Combo)', isActive: true },
          { weightGrams: 2000, label: '2 kg Family Box', isActive: true },
        ],
        images: [
          {
            url: '/images/snacks/tea-time-combo.jpg',
            alt: 'Kathiyawadi Evening Tea Combo Platter',
            isPrimary: true,
          },
        ],
        isFeatured: true,
        isBestseller: true,
        isActive: true,
        shelfLife: '60 days from packaging',
      });

      await Inventory.create({
        product: comboProduct._id,
        availableGrams: 20000,
        lowStockThresholdGrams: 3000,
        adjustmentLogs: [
          {
            adjustmentGrams: 20000,
            previousGrams: 0,
            newGrams: 20000,
            reason: 'initial_seed',
          },
        ],
      });
      console.log(`[Seed] Created Special Combo Snack: ${comboProduct.name}`);
    } else if (comboProduct) {
      comboProduct.images = [
        {
          url: '/images/snacks/tea-time-combo.jpg',
          alt: 'Kathiyawadi Evening Tea Combo Platter',
          isPrimary: true,
        },
      ];
      await comboProduct.save();
      console.log(`[Seed] Combo snack updated with verified image: ${comboProduct.name}`);
    }

    // 4. Seed Banners (Strictly snacks-only!)
    await Banner.deleteMany({});
    await Banner.create([
      {
        title: 'Authentic Kathiyawadi Homemade Snacks',
        subtitle: 'Hand-crafted daily in Rajkot with pure groundnut oil and traditional Gujarati spices.',
        tag: '100% Homemade & Fresh',
        imageUrl: '/images/snacks/tikha-gathiya.jpg',
        link: '/snacks',
        sortOrder: 1,
        isActive: true,
      },
      {
        title: 'Crispy, Savory Teatime Delicacies',
        subtitle: 'From spicy Tikha Gathiya to light Poha Chevdo, experience the true taste of Saurashtra.',
        tag: 'Select Weight: 250g to 2kg',
        imageUrl: '/images/snacks/tea-time-combo.jpg',
        link: '/combo-builder',
        sortOrder: 2,
        isActive: true,
      },
    ]);
    console.log('[Seed] Created Snacks Promotional Banners with local images');

    // 5. Seed Welcome Coupons
    const existingCoupon = await Coupon.findOne({ code: 'SWAGAT10' });
    if (!existingCoupon) {
      await Coupon.create({
        code: 'SWAGAT10',
        description: '10% discount on orders above ₹499',
        discountType: 'percentage',
        discountValue: 10,
        minOrderValue: 499,
        maxDiscount: 150,
        expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 months
        usageLimit: 500,
        isActive: true,
      });
      console.log('[Seed] Created Welcome Coupon: SWAGAT10');
    }

    const existingFlatCoupon = await Coupon.findOne({ code: 'GIRIRAJ50' });
    if (!existingFlatCoupon) {
      await Coupon.create({
        code: 'GIRIRAJ50',
        description: 'Flat ₹50 OFF on orders above ₹699',
        discountType: 'fixed',
        discountValue: 50,
        minOrderValue: 699,
        expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
        usageLimit: 500,
        isActive: true,
      });
      console.log('[Seed] Created Flat Coupon: GIRIRAJ50');
    }

    // 6. Ensure Business Settings exist
    let settings = await BusinessSettings.findOne();
    if (!settings) {
      settings = await BusinessSettings.create({});
      console.log('[Seed] Initialized Business Settings for Giriraj Homemade Gujarati Snacks');
    }

    console.log('[Seed] ✅ Database seeding completed successfully! All 10 snacks and categories are in MongoDB.');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('[Seed] ❌ Seeding Error:', err);
    process.exit(1);
  }
};

seedDatabase();

