require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
  try {
    console.log('🔄 Testing MongoDB Connection...');
    console.log('Database URI:', process.env.MONGODB_URI ? 'Found' : 'Missing');
    
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected Successfully!');
    console.log('🏆 Host:', conn.connection.host);
    console.log('📊 Database:', conn.connection.name);
    console.log('📡 Ready State:', conn.connection.readyState);
    
    await mongoose.disconnect();
    console.log('👋 Connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection Failed:');
    console.error('Error:', error.message);
    console.error('Code:', error.code);
    process.exit(1);
  }
}

testConnection();