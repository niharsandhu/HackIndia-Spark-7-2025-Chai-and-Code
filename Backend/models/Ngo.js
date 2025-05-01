const mongoose = require('mongoose');
 
const ngoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  walletAddress: { type: String, unique: true, required: true },
  darpanId: { type: String, unique: true, required: true },
  metadata: { type: String, required: true },
  isApproved: { type: Boolean, default: false },
  needsFunding: { type: Boolean, default: false },
  totalReceived: { type: Number, default: 0 },
  blockchainId: { type: Number, required: true }, // ✅ Add this
  fundingHistory: [{
    amount: { type: Number, required: true },
    transactionHash: { type: String, required: true },
    date: { type: Date, default: Date.now },
  }],
});
const Ngo = mongoose.model('Ngo', ngoSchema);

module.exports = Ngo;