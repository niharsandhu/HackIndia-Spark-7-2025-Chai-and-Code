const mongoose = require('mongoose');

const fundSchema = new mongoose.Schema(
  {
    ngoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'NGO',
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    usage: {
      type: String,
      required: true,
      enum: ['Food', 'Daily Essentials', 'Medicines', 'Clothes', 'Others']
    },
    dateUsed: {
      type: Date,
      required: true,
      default: Date.now
    },
    description: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Fund', fundSchema);
