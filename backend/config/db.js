const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return false; // Not in-memory
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.log('🚀 Starting In-Memory Database Fallback...');
    
    try {
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
      console.log('✨ In-Memory MongoDB Started & Connected!');
      return true; // In-memory
    } catch (innerError) {
      console.error(`❌ Failed to start In-Memory MongoDB: ${innerError.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
