const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Simple connection without options for Atlas compatibility
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB Error: ${error.message}`);
    // Don't exit - let server run without DB for demo
    console.log('🔄 Server will continue without database...');
  }
};

module.exports = connectDB;
