const mongoose = require('mongoose');

const aidReceiverSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    noOfFamilyMembers: {
      type: Number,
      required: true,
      min: 1
    },
    familyLeaderName: {
      type: String,
      required: true,
      trim: true
    },
    crisisId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Crisis',
      required: true
    },
    qrCode: {
      type: String // stores base64 image string or URL
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('AidReceiver', aidReceiverSchema);
