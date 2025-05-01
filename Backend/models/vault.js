const mongoose = require('mongoose');

const donationVaultSchema = new mongoose.Schema({
  totalReceived: {
    type: Number,
    default: 0,
  },
  totalDistributed: {
    type: Number,
    default: 0,
  },
  totalReturned: {
    type: Number,
    default: 0,
  }
,  
  donations: [
    {
      donorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      transactionHash: {
        type: String, // Optional: if linked to blockchain transaction
      },
      date: {
        type: Date,
        default: Date.now,
      },
    }
  ],
  fundings: [
    {
      ngoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ngo',
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
      returnAmount: {
        type: Number,
        default: 0,
      },
    }
  ],
});

module.exports = mongoose.model('DonationVault', donationVaultSchema);
