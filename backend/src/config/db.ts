import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer: MongoMemoryServer | null = null;

export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI;

  try {
    if (uri && uri.trim() !== '') {
      console.log(`Connecting to MongoDB URI: ${uri}`);
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 3000,
      });
      console.log('MongoDB connected successfully via URI.');
      return;
    }
  } catch (error) {
    console.warn('Could not connect to external MongoDB URI. Starting embedded MongoMemoryServer fallback...');
  }

  try {
    mongoMemoryServer = await MongoMemoryServer.create();
    const memoryUri = mongoMemoryServer.getUri();
    console.log(`Connecting to embedded Memory DB: ${memoryUri}`);
    await mongoose.connect(memoryUri);
    console.log('MongoDB connected successfully via Memory Server.');
  } catch (err) {
    console.error('Failed to initialize MongoDB connection:', err);
    process.exit(1);
  }
};

export const closeDB = async (): Promise<void> => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};
