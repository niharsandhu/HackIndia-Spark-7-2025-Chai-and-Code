const Ngo = require('../models/Ngo');

// Register a new NGO
exports.registerNgo = async (req, res) => {
  const {
    name,
    darpanId,
    walletAddress,
    walletType, // 'Ethereum' or 'USDT'
    district,
    state,
    sector,
    npoType,
    coordinates, // [lng, lat] from frontend
  } = req.body;

  if (!walletAddress || !darpanId || !name || !walletType || !district || !state || !sector || !npoType || !coordinates) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {

    // Check for duplicate DARPAN ID or wallet
    const existingNgo = await Ngo.findOne({
      $or: [{ walletAddress }, { darpanId }]
    });

    if (existingNgo) {
      return res.status(400).json({ message: 'NGO already registered with same wallet or DARPAN ID' });
    }

    // Create and save the NGO
    const newNgo = new Ngo({
      name,
      darpanId,
      walletAddress,
      walletType,
      district,
      state,
      sector,
      npoType,
      location: {
        type: 'Point',
        coordinates,
      }
    });

    await newNgo.save();
    return res.status(200).json({ message: 'NGO submitted successfully. Pending verification.' });

  } catch (error) {
    console.error('NGO Registration Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all NGOs (Admin)
exports.getAllNgos = async (req, res) => {
  try {

    const ngos = await Ngo.find();
    return res.status(200).json(ngos);
  } catch (error) {
    console.error('Get NGOs Error:', error);
    return res.status(500).json({ message: 'Error fetching NGOs' });
  }
};

// Verify or reject an NGO (Admin)
exports.verifyNgo = async (req, res) => {
  const { walletAddress, verified } = req.body;

  if (!walletAddress || typeof verified !== 'boolean') {
    return res.status(400).json({ message: 'Invalid verification request' });
  }

  try {


    const ngo = await Ngo.findOne({ walletAddress });
    if (!ngo) {
      return res.status(404).json({ message: 'NGO not found' });
    }

    ngo.verified = verified;
    await ngo.save();

    return res.status(200).json({ message: `NGO has been ${verified ? 'approved' : 'rejected'}` });

  } catch (error) {
    console.error('Verify NGO Error:', error);
    return res.status(500).json({ message: 'Error verifying NGO' });
  }
};
