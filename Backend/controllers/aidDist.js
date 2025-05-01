const Aid = require('../models/Aid');
const AidReceiver = require('../models/AidReceiver');
const AidDistribution = require('../models/aidDistribution');

exports.distributeAid = async (req, res) => {
  try {
    const { aidId, aidReceiverId, quantityGiven } = req.body;

    const aid = await Aid.findById(aidId);
    if (!aid) return res.status(404).json({ message: 'Aid not found' });

    if (aid.quantityPurchased < quantityGiven) {
      return res.status(400).json({ message: 'Not enough aid available' });
    }

    const receiver = await AidReceiver.findById(aidReceiverId);
    if (!receiver) return res.status(404).json({ message: 'Aid receiver not found' });

    aid.quantityPurchased -= quantityGiven;
    await aid.save();

    const distribution = new AidDistribution({ aidId, aidReceiverId, quantityGiven });
    await distribution.save();

    res.status(201).json({ message: 'Aid distributed successfully', distribution });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
