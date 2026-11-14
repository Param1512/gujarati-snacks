const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: __dirname + '/../.env' });
const BusinessSettings = require('../models/BusinessSettings');
const Coupon = require('../models/Coupon');

const updateBrand = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gujarati_store';
    await mongoose.connect(mongoUri);
    console.log('[BrandUpdate] Connected to MongoDB');

    const updateRes = await BusinessSettings.updateMany({}, {
      storeName: 'Gujarati Homemade Nasta & Snacks',
      storeNameGujarati: 'ગુજરાતી હોમમેડ નાસ્તા અને સ્નેક્સ',
      email: 'orders@gujaratinasta.com',
      'socialLinks.instagram': 'https://instagram.com/gujaratinasta',
      'socialLinks.facebook': 'https://facebook.com/gujaratinasta'
    });
    console.log('[BrandUpdate] BusinessSettings updated:', updateRes.modifiedCount);

    const couponRes = await Coupon.updateMany({ code: 'GIRIRAJ50' }, {
      code: 'NASTA50',
      description: 'Flat ₹50 OFF on orders above ₹699'
    });
    console.log('[BrandUpdate] Coupon updated:', couponRes.modifiedCount);

    await mongoose.disconnect();
    console.log('[BrandUpdate] Done');
    process.exit(0);
  } catch (err) {
    console.log('[BrandUpdate] Error:', err.message);
    process.exit(0);
  }
};

updateBrand();
