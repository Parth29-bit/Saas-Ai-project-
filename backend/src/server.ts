import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { connectDB } from './config/db';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 Supportly AI Server running in ${process.env.NODE_ENV || 'development'} mode`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`=======================================================`);
  });
};

startServer();
