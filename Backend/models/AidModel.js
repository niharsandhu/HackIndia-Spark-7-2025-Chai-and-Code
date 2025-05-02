const mongoose = require('mongoose');

const aidSchema = new mongoose.Schema({
  aidType: {
    type: String,
    required: true,
    enum: ['Food', 'Daily Essentials', 'Medicines', 'Clothes']
  },
  quantityPurchased: {
    type: Number,
    required: true,
    min: 1
  },
  totalCost: {
    type: Number,
    required: true,
    min: 0
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  ngoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NGO',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Aid', aidSchema);
