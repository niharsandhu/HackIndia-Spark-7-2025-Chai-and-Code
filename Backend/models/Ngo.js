const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const ngoSchema = new mongoose.Schema({
  darbanId: { type: String, required: true },
  name: { type: String, required: true },
  state: { type: String, required: true },
  district: { type: String, required: true },
  email: { type: String, required: true },
  phoneNo: { type: String, required: true },
  type: { type: String, required: true },
  blockchainWalletAddress: { type: String, required: true, unique: true },
  status: {
    isVerified: { type: Boolean, default: false }
  },
  nonce: {
    type: String,
    default: uuidv4
  }
});

module.exports = mongoose.model('NGO', ngoSchema);
