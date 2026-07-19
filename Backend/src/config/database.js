import mongoose from 'mongoose';

let isConnected = false;

export const getConnectionStatus = () => isConnected;

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    isConnected = true;
    console.log(`MongoDB Connected: ${connect.connection.host}`);
    console.log(`Database Name: ${connect.connection.name}`);
  } catch (error) {
    console.warn(`⚠️ MongoDB unavailable (${error.message}) — running in offline API mode`);
    console.warn('⚠️ All data operations will return errors. Start MongoDB or update MONGODB_URI in .env');
    isConnected = false;
  }
};

mongoose.connection.on('connected', () => { isConnected = true; console.log('Mongoose connected to MongoDB'); });
mongoose.connection.on('error', (err) => { console.error(`Mongoose connection error: ${err}`); });
mongoose.connection.on('disconnected', () => { isConnected = false; console.log('Mongoose disconnected from MongoDB'); });

export default connectDB;
