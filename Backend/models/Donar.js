const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const donorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phoneNo: { type: String, required: true },
  blockchainWalletAddress: { type: String, required: true, unique: true },
});

module.exports = mongoose.model('Donor', donorSchema);
