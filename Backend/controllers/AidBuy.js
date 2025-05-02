const Aid = require('../models/AidModel');
const NGO = require('../models/Ngo');

exports.buyAid = async (req, res) => {
  try {
    const { aidType, quantityPurchased, unitCost, ngoId } = req.body;

    const ngo = await NGO.findById(ngoId);
    if (!ngo) return res.status(404).json({ message: 'NGO not found' });

    const totalCost = quantityPurchased * unitCost;

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

exports.getAidSummary = async (req, res) => {
  try {
    // Fetch all aids and select only aidType and totalCost
    const aidSummary = await Aid.find({}, 'aidType totalCost');

    res.status(200).json({
      success: true,
      data: aidSummary,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve aid summary',
      error: error.message,
    });
  }
};
