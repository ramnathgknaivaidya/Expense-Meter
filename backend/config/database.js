const mongoose = require('mongoose');
const { databaseUrl } = require('./environment');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
  try {
    const url = process.env.DEMO_MODE === 'true' ? await startInMemory() : databaseUrl;
    const conn = await mongoose.connect(url);
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    const fallbackUrl = await startInMemory();
    const conn = await mongoose.connect(fallbackUrl);
    console.log(`MongoDB (in-memory fallback) connected: ${conn.connection.host}`);
    return conn;
  }
};

async function startInMemory() {
  const mongod = await MongoMemoryServer.create();
  return mongod.getUri();
}

module.exports = connectDB;
