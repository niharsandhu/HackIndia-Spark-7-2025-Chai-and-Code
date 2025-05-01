const Aid = require('../models/AidModel');
const NGO = require('../models/Ngo');

exports.buyAid = async (req, res) => {
  try {
    const { aidType, quantityPurchased, totalCost, ngoId } = req.body;

    const ngo = await NGO.findById(ngoId);
    if (!ngo) return res.status(404).json({ message: 'NGO not found' });

    if (ngo.totalDonationReceived < totalCost) {
      return res.status(400).json({ message: 'Insufficient funds' });
    }

    ngo.totalDonationReceived -= totalCost;
    await ngo.save();

    const aid = new Aid({ aidType, quantityPurchased, totalCost, ngoId });
    await aid.save();

    res.status(201).json({ message: 'Aid purchased successfully', aid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
