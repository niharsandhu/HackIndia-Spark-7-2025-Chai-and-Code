const mongoose = require('mongoose');

const aidDistributionSchema = new mongoose.Schema(
  {
    aidId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Aid',
      required: true
    },
    aidReceiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AidReceiver',
      required: true
    },
    quantityGiven: {
      type: Number,
      required: true,
      min: 1
    },
    dateGiven: {
      type: Date,
      required: true,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('AidDistribution', aidDistributionSchema);
