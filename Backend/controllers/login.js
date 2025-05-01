const NGO = require('../models/Ngo');
const Donor = require('../models/Donar');
const AidReceiver = require('../models/Receiver');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // For generating JWT tokens

// Login for NGO
// Login for NGO
const loginNGO = async (req, res) => {
    try {
      const { email, blockchainWalletAddress } = req.body;
  
      // Check if NGO exists
      const ngo = await NGO.findOne({ email });
      if (!ngo) {
        return res.status(400).json({ message: 'NGO not found with this email.' });
      }
  
      // Optionally, you can check blockchainWalletAddress if needed
  
      // Generate JWT token
      const token = jwt.sign({ ngoId: ngo._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      // Send the response and save the ngoId in localStorage on the frontend
      return res.status(200).json({
        message: 'NGO login successful.',
        token,
        ngoId: ngo._id, // You can store this in localStorage in the frontend
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error during NGO login.' });
    }
  };
  
  // Login for Donor
  const loginDonor = async (req, res) => {
    try {
      const { email, blockchainWalletAddress } = req.body;
  
      // Check if Donor exists
      const donor = await Donor.findOne({ email });
      if (!donor) {
        return res.status(400).json({ message: 'Donor not found with this email.' });
      }
  
      // Optionally, you can check blockchainWalletAddress if needed
  
      // Generate JWT token
      const token = jwt.sign({ donorId: donor._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      // Send the response and save the donorId in localStorage on the frontend
      return res.status(200).json({
        message: 'Donor login successful.',
        token,
        donorId: donor._id, // You can store this in localStorage in the frontend
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error during Donor login.' });
    }
  };
  

// Login for AidReceiver
const loginAidReceiver = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if Aid Receiver exists
    const receiver = await AidReceiver.findOne({ email });
    if (!receiver) {
      return res.status(400).json({ message: 'Aid Receiver not found with this email.' });
    }

    // Validate the password
    const isPasswordCorrect = await bcrypt.compare(password, receiver.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid password.' });
    }

    // Generate JWT token
    const token = jwt.sign({ aidReceiverId: receiver._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send the response for AidReceiver login
    return res.status(200).json({
      message: 'Aid Receiver login successful.',
      token,
      aidReceiverId: receiver._id, // You can store this in localStorage in the frontend
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error during Aid Receiver login.' });
  }
};

module.exports = {
  loginNGO,
  loginDonor,
  loginAidReceiver,
};
