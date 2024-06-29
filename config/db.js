// backend/config/db.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env file

// MongoDB connection options
const options = {
};

// MongoDB connection URI
const mongoURI = process.env.CONNECTION_STRING;

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, options);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
  }
};

module.exports = connectDB;
