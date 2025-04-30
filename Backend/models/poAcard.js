const mongoose = require('mongoose');
const aidEntrySchema = require('./AidEntry'); // Reference to AidEntry schema

const poaCardSchema = new mongoose.Schema({
  familyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Family',
    unique: true,
    required: true,
  },
  issuedDate: {
    type: Date,
    default: Date.now,
  },
  aidHistory: [aidEntrySchema], // Aid history linked to family
});

module.exports = mongoose.model('PoaCard', poaCardSchema);
