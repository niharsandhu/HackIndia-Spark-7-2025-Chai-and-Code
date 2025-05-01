const NGO = require('../models/Ngo');
const Donor = require('../models/Donar');
const AidReceiver = require('../models/Receiver');
const Crisis = require('../models/Crises');
const QRCode = require('qrcode');
const bcrypt = require('bcrypt');

// Register NGO
const registerNGO = async (req, res) => {
  try {
    const { darbanId, name, state, district, email, phoneNo, type, blockchainWalletAddress } = req.body;

    // Check if NGO already exists
    const existingNGO = await NGO.findOne({ email });
    if (existingNGO) {
      return res.status(400).json({ message: 'NGO with this email already exists.' });
    }

    const newNGO = new NGO({
      darbanId,
      name,
      state,
      district,
      email,
      phoneNo,
      type,
      blockchainWalletAddress
    });

    await newNGO.save();
    return res.status(201).json({ message: 'NGO registered successfully.', ngo: newNGO });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error during NGO registration.' });
  }
};

// Register Donor
const registerDonor = async (req, res) => {
  try {
    const { blockchainWalletAddress, name, phoneNo, email } = req.body;

    // Check if Donor already exists
    const existingDonor = await Donor.findOne({ email });
    if (existingDonor) {
      return res.status(400).json({ message: 'Donor with this email already exists.' });
    }

    const newDonor = new Donor({
      blockchainWalletAddress,
      name,
      phoneNo,
      email
    });

    await newDonor.save();
    return res.status(201).json({ message: 'Donor registered successfully.', donor: newDonor });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error during Donor registration.' });
  }
};

// Register Aid Receiver
const registerAidReceiver = async (req, res) => {
  try {
    const {
      email,
      password,
      noOfFamilyMembers,
      familyLeaderName,
      latitude,
      longitude
    } = req.body;

    const existingReceiver = await AidReceiver.findOne({ email });
    if (existingReceiver) {
      return res.status(400).json({ message: 'Aid Receiver with this email already exists.' });
    }

    // Find nearby crisis using Haversine formula
    const allCrises = await Crisis.find();
    const toRad = deg => deg * Math.PI / 180;

    const findNearbyCrisis = (userLat, userLon, maxDistanceKm = 50) => {
      for (let crisis of allCrises) {
        const dLat = toRad(crisis.latitude - userLat);
        const dLon = toRad(crisis.longitude - userLon);
        const a =
          Math.sin(dLat / 2) ** 2 +
          Math.cos(toRad(userLat)) *
          Math.cos(toRad(crisis.latitude)) *
          Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = 6371 * c; // Radius of the Earth in km
        if (distance <= maxDistanceKm) return crisis;
      }
      return null;
    };

    const nearbyCrisis = findNearbyCrisis(latitude, longitude);
    if (!nearbyCrisis) {
      return res.status(404).json({ message: 'No crisis found within 50km radius.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAidReceiver = new AidReceiver({
      email,
      password: hashedPassword,
      noOfFamilyMembers,
      familyLeaderName,
      latitude,
      longitude,
      crisisId: nearbyCrisis._id
    });

    await newAidReceiver.save();

    const qrData = `${newAidReceiver._id}`;
    const qrCodeImage = await QRCode.toDataURL(qrData);

    newAidReceiver.qrCode = qrCodeImage;
    await newAidReceiver.save();

    return res.status(201).json({
      message: 'Aid Receiver registered successfully.',
      aidReceiver: {
        _id: newAidReceiver._id,
        email: newAidReceiver.email,
        familyLeaderName: newAidReceiver.familyLeaderName,
        noOfFamilyMembers: newAidReceiver.noOfFamilyMembers,
        latitude: newAidReceiver.latitude,
        longitude: newAidReceiver.longitude,
        crisisId: newAidReceiver.crisisId,
        qrCode: newAidReceiver.qrCode
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error during Aid Receiver registration.' });
  }
};


module.exports = {
  registerNGO,
  registerDonor,
  registerAidReceiver
};
