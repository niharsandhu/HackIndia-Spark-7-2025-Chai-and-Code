const mongoose = require('mongoose');

const aidReceiverSchema = new mongoose.Schema({
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
  latitude: {
    type: Number,
    required: true,
    min: -90,
    max: 90
  },
  longitude: {
    type: Number,
    required: true,
    min: -180,
    max: 180
  },
  qrCode: String
}, {
  timestamps: true
});

module.exports = mongoose.model('AidReceiver', aidReceiverSchema);
