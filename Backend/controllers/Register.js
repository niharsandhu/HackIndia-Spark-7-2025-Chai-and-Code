const NGO = require('../models/Ngo');
const Donor = require('../models/Donar');
const AidReceiver = require('../models/Receiver');
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
    const { blockchainWalletAddress, name, phone, email } = req.body;

    // Check if Donor already exists
    const existingDonor = await Donor.findOne({ email });
    if (existingDonor) {
      return res.status(400).json({ message: 'Donor with this email already exists.' });
    }

    const newDonor = new Donor({
      blockchainWalletAddress,
      name,
      phone,
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
      const { email, password, noOfFamilyMembers, familyLeaderName, crisisId } = req.body;
  
      const existingReceiver = await AidReceiver.findOne({ email });
      if (existingReceiver) {
        return res.status(400).json({ message: 'Aid Receiver with this email already exists.' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newAidReceiver = new AidReceiver({
        email,
        password: hashedPassword,
        noOfFamilyMembers,
        familyLeaderName,
        crisisId
      });
  
      await newAidReceiver.save();
  
      // Generate a QR Code that encodes the aid receiver's ID
      const qrData = `${newAidReceiver._id}`; // or any custom info
      const qrCodeImage = await QRCode.toDataURL(qrData);
  
      // Save the QR code in the database
      newAidReceiver.qrCode = qrCodeImage;
      await newAidReceiver.save();
  
      return res.status(201).json({
        message: 'Aid Receiver registered successfully.',
        aidReceiver: {
          _id: newAidReceiver._id,
          email: newAidReceiver.email,
          familyLeaderName: newAidReceiver.familyLeaderName,
          noOfFamilyMembers: newAidReceiver.noOfFamilyMembers,
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
