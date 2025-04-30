const mongoose = require('mongoose');

const aidEntrySchema = new mongoose.Schema({
  ngoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ngo', // Reference to the NGO that distributed aid
    required: true,
  },
  aidType: {
    type: String,
    enum: ['food', 'medicine', 'daily essentials'],
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  notes: String,
  transactionHash: {
    type: String, // Linked to blockchain transaction hash
  },
});

module.exports = mongoose.model('AidEntry', aidEntrySchema);
