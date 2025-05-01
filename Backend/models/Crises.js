const mongoose = require('mongoose');

const crisisSchema = new mongoose.Schema(
  {
    name:{
        type: String,
        required: true,
        trim: true
        },
    place: {
      type: String,
      required: true,
      trim: true
    },
    ngoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'NGO',
      required: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    peopleAffected: {
      type: Number,
      required: true,
      min: 1
    },
    situationRating: {
      type: Number,
      required: true,
      min: 1,
      max: 10
    },
    fundsRequired: {
      type: Number,
      required: true,
      min: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Crisis', crisisSchema);
