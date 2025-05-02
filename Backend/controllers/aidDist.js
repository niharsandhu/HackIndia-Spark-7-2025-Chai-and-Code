const Aid = require('../models/AidModel');
const AidReceiver = require('../models/Receiver');
const AidDistribution = require('../models/aidDistribution');

exports.scannerDistributeAid = async (req, res) => {
    try {
      const { aidType, quantityGiven, qrCodeData } = req.body;
  
      // qrCodeData should be the scanned value, ideally the AidReceiver's ID
      const aidReceiverId = qrCodeData;
  
      // Find the aid based on the aidType
      const aid = await Aid.findOne({ type: aidType }); // assuming `type` is the field that stores aid type
      if (!aid) return res.status(404).json({ message: 'Aid type not found' });
  
      // Check if the requested quantity is available
      if (aid.quantityPurchased < quantityGiven) {
        return res.status(400).json({ message: 'Not enough aid available' });
      }
  
      // Find the receiver using qrCodeData (AidReceiverId)
      const receiver = await AidReceiver.findById(aidReceiverId);
      if (!receiver) return res.status(404).json({ message: 'Aid receiver not found' });
  
      // Prevent duplicate distribution (optional logic)
      const alreadyDistributed = await AidDistribution.findOne({ aidId: aid._id, aidReceiverId });
      if (alreadyDistributed) {
        return res.status(400).json({ message: 'Aid already distributed to this receiver.' });
      }
  
      // Update the aid quantity
      aid.quantityPurchased -= quantityGiven;
      await aid.save();
  
      // Create a new record in the distribution model
      const distribution = new AidDistribution({
        aidId: aid._id, // Use the aid's _id as the reference
        aidReceiverId,
        quantityGiven,
      });
      await distribution.save();
  
      res.status(201).json({
        message: 'Aid distributed successfully via QR scan',
        receiver: receiver.familyLeaderName,
        distribution,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  