const mongoose = require('mongoose');

const familySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  password: {
    type: String, // Hash if needed
  },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number], // For geolocation
  },
  poaCardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PoaCard', // Reference to PoaCard schema
  },
});

module.exports = mongoose.model('Family', familySchema);
