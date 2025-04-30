const mongoose = require('mongoose');

const ngoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  walletAddress: {
    type: String,
    unique: true,
    required: true,
  },
  darpanId: {
    type: String,
    unique: true,
    required: true,
  },
  metadata: {
    type: String,  // Represents IPFS metadata link
    required: true,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  needsFunding: {
    type: Boolean,
    default: false,
  },
  totalReceived: {
    type: Number,
    default: 0,
  },
  fundingHistory: [{
    amount: {
      type: Number,
      required: true,
    },
    transactionHash: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  }],
});

module.exports = mongoose.model('Ngo', ngoSchema);
