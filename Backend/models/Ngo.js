const mongoose = require('mongoose');

const ngoSchema = new mongoose.Schema(
  {
    darbanId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    district: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    phoneNo: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['Health', 'Education', 'Environment', 'Animal Welfare', 'Others'],
      required: true
    },
    status: {
      isVerified: {
        type: Boolean,
        default: false
      }
    },
    totalDonationReceived: {
      type: Number,
      default: 0
    },
    blockchainWalletAddress: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('NGO', ngoSchema);
