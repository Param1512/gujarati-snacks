const mongoose = require('mongoose');

const connectDatabase = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gujarati_store';

  const options = {
    serverSelectionTimeoutMS: 5000,
    autoIndex: true,
  };

  try {
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
    console.error('[MongoDB] Make sure MongoDB Community Server is installed and running on port 27017.');
    throw error;
  }
};

module.exports = connectDatabase;

