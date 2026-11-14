const mongoose = require('mongoose');

const connectDatabase = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gujarati_store';

  const options = {
    serverSelectionTimeoutMS: 5000,
    autoIndex: true,
  };

  try {
    if (!process.env.MONGO_URI && (process.env.NODE_ENV === 'production' || process.env.RENDER)) {
      console.warn('⚠️ [MongoDB] process.env.MONGO_URI is not set in Render Environment Variables!');
    }

    const conn = await mongoose.connect(mongoURI, options);
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}, database: ${conn.connection.name}`);
    
    mongoose.connection.on('error', (err) => {
      console.error(`[MongoDB] Runtime connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[MongoDB] Connection lost. Attempting reconnection...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('[MongoDB] Connection re-established.');
    });

    return conn;
  } catch (error) {
    console.error(`[MongoDB] Initial connection error: ${error.message}`);
    if (!process.env.MONGO_URI) {
      console.error('👉 ACTION REQUIRED ON RENDER:');
      console.error('1. Go to your Render Dashboard -> Web Service -> "Environment" tab');
      console.error('2. Add Environment Variable: MONGO_URI=<your MongoDB Atlas connection string>');
    } else {
      console.error('[MongoDB] Make sure your MongoDB host IP whitelist allows 0.0.0.0/0 (access from anywhere) on MongoDB Atlas.');
    }
    throw error;
  }
};

module.exports = connectDatabase;

