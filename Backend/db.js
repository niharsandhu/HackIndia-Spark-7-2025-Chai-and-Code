const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://niharsandhu25:rHcv3dX3Ikvz1CLT@cluster0.rako9fn.mongodb.net/', {
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Stop the server if MongoDB connection fails
  }
};

module.exports = connectDB;
