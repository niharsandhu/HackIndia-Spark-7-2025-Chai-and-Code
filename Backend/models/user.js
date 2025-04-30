const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['donor', 'ngo', 'family'],
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
  },
  walletAddress: {
    type: String,
    unique: true,  // For donor and NGO
  },
  password: {
    type: String, // For family only
  },
  darpanId: {
    type: String,  // For NGO only
    unique: true,
  },
  verified: {
    type: Boolean, // For NGO
    default: false,
  },
  ngoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ngo', // Reference to NGO for donor/family if applicable
  },
  totalDonations: { type: Number, default: 0 }, // Track total donations
  donationHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donation', // Reference to the Donation model
  }],
});

module.exports = mongoose.model('User', userSchema);
