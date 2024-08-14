import mongoose from 'mongoose';

const MONGODB_URI = process.env.NEXT_PUBLIC_MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MongoDB URI is not defined in the environment variables.');
}

let isConnected = false;

const connectToDatabase = async () => {
  const uri = MONGODB_URI;
  if (!uri) {
    throw new Error('MongoDB URI is not defined in the environment variables.');
  }

  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    await mongoose.connect(uri);
    isConnected = true;
    console.log('Successfully connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error; 
  }
};

export default connectToDatabase;