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


exports.getReceiverDetails = async (req, res) => {
  try {
    const { receiverId } = req.params;

    // Fetch AidReceiver with crisis name populated
    const receiver = await AidReceiver.findById(receiverId)
      .populate('crisisId', 'name') // assuming Crisis model has a 'name' field
      .lean();

    if (!receiver) {
      return res.status(404).json({ message: 'Aid receiver not found' });
    }

    // Fetch all aid distributions related to this receiver
   // Correct field name used for population: 'aidType' instead of 'type'
const distributions = await AidDistribution.find({ aidReceiverId: receiverId })
.populate('aidId', 'aidType')
.select('quantityGiven dateGiven aidId')
.lean();

const response = {
familyLeaderName: receiver.familyLeaderName,
noOfFamilyMembers: receiver.noOfFamilyMembers,
location: {
  latitude: receiver.latitude,
  longitude: receiver.longitude,
},
crisisName: receiver.crisisId?.name || 'Unknown',
aidReceived: distributions.map(dist => ({
  aidType: dist.aidId?.aidType || 'Unknown',
  quantity: dist.quantityGiven,
  date: dist.dateGiven,
}))
};


    res.status(200).json(response);

  } catch (error) {
    console.error('Error fetching receiver details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
