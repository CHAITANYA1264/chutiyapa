import mongoose from 'mongoose';

let isConnected = false; // Track if we're already connected

export const connectionToDatabase = async () => {
  if (isConnected) {
    console.log('Already connected to the database');
    return;
  }

  try {
    await mongoose.connect(process.env.MongoURL || 'mongodb://localhost:27017/stock', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = true;
    console.log('Connected to the database');
  } catch (err) {
    console.error('Error connecting to the database:', err);
  }
};

export default connectionToDatabase;
