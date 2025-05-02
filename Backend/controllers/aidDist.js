const Aid = require('../models/AidModel');
const AidReceiver = require('../models/Receiver');
const AidDistribution = require('../models/aidDistribution');

exports.scannerDistributeAid = async (req, res) => {
  try {
    const { aidId, quantityGiven, qrCodeData } = req.body;

    // qrCodeData should be the scanned value, ideally the AidReceiver's ID
    const aidReceiverId = qrCodeData;

    const aid = await Aid.findById(aidId);
    if (!aid) return res.status(404).json({ message: 'Aid not found' });

    if (aid.quantityPurchased < quantityGiven) {
      return res.status(400).json({ message: 'Not enough aid available' });
    }

    const receiver = await AidReceiver.findById(aidReceiverId);
    if (!receiver) return res.status(404).json({ message: 'Aid receiver not found' });

    // Prevent duplicate distribution (optional logic)
    const alreadyDistributed = await AidDistribution.findOne({ aidId, aidReceiverId });
    if (alreadyDistributed) {
      return res.status(400).json({ message: 'Aid already distributed to this receiver.' });
    }

    aid.quantityPurchased -= quantityGiven;
    await aid.save();

    const distribution = new AidDistribution({ aidId, aidReceiverId, quantityGiven });
    await distribution.save();

    res.status(201).json({
      message: 'Aid distributed successfully via QR scan',
      receiver: receiver.familyLeaderName,
      distribution
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
