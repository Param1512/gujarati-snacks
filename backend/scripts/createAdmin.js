const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const crypto = require('crypto');
const mongoose = require('mongoose');
const User = require('../models/User');

const createFirstAdmin = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gujarati_store';
    await mongoose.connect(mongoURI);
    console.log('[Admin Setup] Connected to MongoDB');

    // Parse command line arguments: --email=... --password=... --name=...
    const args = process.argv.slice(2);
    const parsedArgs = {};
    args.forEach((arg) => {
      if (arg.startsWith('--')) {
        const [k, v] = arg.slice(2).split('=');
        parsedArgs[k] = v;
      }
    });

    const adminEmail = (parsedArgs.email || process.env.ADMIN_EMAIL || 'admin@girirajnasta.com').toLowerCase();
    const adminName = parsedArgs.name || process.env.ADMIN_NAME || 'Giriraj Store Admin';
    const adminPhone = parsedArgs.phone || process.env.ADMIN_PHONE || '+91 98250 12345';
    // Generate secure random password if not supplied
    const generatedPassword = crypto.randomBytes(8).toString('base64').replace(/[^a-zA-Z0-9]/g, 'X') + '!9G';
    const adminPassword = parsedArgs.password || process.env.ADMIN_PASSWORD || generatedPassword;

    let admin = await User.findOne({ email: adminEmail });
    if (admin) {
      admin.role = 'admin';
      admin.password = adminPassword;
      await admin.save();
      console.log(`\n======================================================`);
      console.log(`[Admin Setup] Existing administrator account updated!`);
      console.log(` Email    : ${adminEmail}`);
      console.log(` Password : ${adminPassword}`);
      console.log(` Role     : admin`);
      console.log(`======================================================\n`);
    } else {
      admin = await User.create({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        phone: adminPhone,
        role: 'admin',
      });
      console.log(`\n======================================================`);
      console.log(`[Admin Setup] Secure First Admin Created Successfully!`);
      console.log(` Name     : ${admin.name}`);
      console.log(` Email    : ${admin.email}`);
      console.log(` Password : ${adminPassword}`);
      console.log(` Role     : ${admin.role}`);
      console.log(` Store    : Giriraj Homemade Gujarati Snacks`);
      console.log(`======================================================\n`);
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('[Admin Setup Error]:', error);
    process.exit(1);
  }
};

createFirstAdmin();

