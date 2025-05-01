const { ethers } = require('ethers');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const QRCode = require('qrcode');

const NGO = require('../models/Ngo');
const Donor = require('../models/Donar');
const AidReceiver = require('../models/Receiver');

// Request nonce for MetaMask login (NGO, Donor only)
exports.requestNonce = async (req, res) => {
  const { address, role } = req.body;
  if (!address || !role) return res.status(400).json({ message: 'Address and role required' });

  try {
    const Model = role === 'NGO' ? NGO : role === 'Donor' ? Donor : null;
    if (!Model) return res.status(400).json({ message: 'Invalid role' });

    const user = await Model.findOne({ blockchainWalletAddress: address });
    if (!user) return res.status(404).json({ message: `${role} not found` });

    user.nonce = uuidv4();
    await user.save();

    res.json({ nonce: user.nonce });
  } catch (err) {
    console.error('Error in requestNonce:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Verify MetaMask signature and register if not exists
exports.verifySignature = async (req, res) => {
  const { address, signature, role, ...data } = req.body;
  try {
    const Model = role === 'NGO' ? NGO : role === 'Donor' ? Donor : null;
    if (!Model) return res.status(400).json({ message: 'Invalid role' });

    let user = await Model.findOne({ blockchainWalletAddress: address });

    // If user does not exist, register them
    if (!user) {
      if (role === 'NGO') {
        const requiredFields = [
          'darbanId',
          'name',
          'state',
          'district',
          'email',
          'phoneNo',
          'type',
          'blockchainWalletAddress'
        ];
        for (const field of requiredFields) {
          if (!data[field]) {
            return res.status(400).json({ message: `Missing field for NGO: ${field}` });
          }
        }
        user = new NGO({
          ...data,
          status: { isVerified: false }
        });
      } else if (role === 'Donor') {
        const requiredFields = [
          'name',
          'email',
          'phoneNo',
          'blockchainWalletAddress'
        ];
        for (const field of requiredFields) {
          if (!data[field]) {
            return res.status(400).json({ message: `Missing field for Donor: ${field}` });
          }
        }
        user = new Donor(data);
      }
      user.nonce = uuidv4();
      await user.save();
    }

    // Ensure nonce is set for existing user
    if (!user.nonce) {
      user.nonce = uuidv4();
      await user.save();
    }

    const message = `Login request with nonce: ${user.nonce}`;
    const recoveredAddress = ethers.utils.verifyMessage(message, signature);

    if (recoveredAddress.toLowerCase() !== address.toLowerCase())
      return res.status(401).json({ message: 'Signature verification failed' });

    user.nonce = uuidv4(); // Rotate nonce
    await user.save();

    res.json({ message: 'Login successful', user });
  } catch (err) {
    console.error('Error in verifySignature:', err);
    res.status(500).json({ message: 'Signature verification error', error: err.message });
  }
};

// Register new user (NGO, Donor via MetaMask | AidReceiver via Email/Password)
exports.registerUser = async (req, res) => {
  const { role, ...data } = req.body;

  try {
    if (role === 'NGO') {
      const requiredFields = [
        'darbanId',
        'name',
        'state',
        'district',
        'email',
        'phoneNo',
        'type',
        'blockchainWalletAddress'
      ];
      for (const field of requiredFields) {
        if (!data[field]) {
          return res.status(400).json({ message: `Missing field for NGO: ${field}` });
        }
      }
      const newNGO = new NGO({
        ...data,
        status: { isVerified: false },
        nonce: uuidv4()
      });
      await newNGO.save();
      return res.status(201).json({ message: 'NGO registered successfully' });

    } else if (role === 'Donor') {
      const requiredFields = [
        'name',
        'email',
        'phoneNo',
        'blockchainWalletAddress'
      ];
      for (const field of requiredFields) {
        if (!data[field]) {
          return res.status(400).json({ message: `Missing field for Donor: ${field}` });
        }
      }
      const newDonor = new Donor({
        ...data,
        nonce: uuidv4()
      });
      await newDonor.save();
      return res.status(201).json({ message: 'Donor registered successfully' });

    } else if (role === 'AidReceiver') {
      const { email, password, numberOfFamilyMembers, familyLeaderName, location } = data;
      if (!email || !password || !numberOfFamilyMembers || !familyLeaderName || !location?.lat || !location?.lng) {
        return res.status(400).json({ message: 'Missing required fields for AidReceiver' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const qrData = `Family Leader: ${familyLeaderName}, Location: (${location.lat}, ${location.lng})`;
      const qrCode = await QRCode.toDataURL(qrData);

      const aidReceiver = new AidReceiver({
        ...data,
        password: hashedPassword,
        qrCode,
      });

      await aidReceiver.save();
      return res.status(201).json({ message: 'Aid receiver registered successfully', qrCode });

    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }
  } catch (err) {
    console.error('Error in registerUser:', err);
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

// Login AidReceiver with email and password
exports.loginAidReceiver = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await AidReceiver.findOne({ email });
    if (!user) return res.status(404).json({ message: 'No such user' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    res.json({ message: 'Login successful', user });
  } catch (err) {
    console.error('Error in loginAidReceiver:', err);
    res.status(500).json({ message: 'Login error', error: err.message });
  }
};

// Check if address is registered
exports.checkRegistration = async (req, res) => {
  const { address, role } = req.body;
  if (!address || !role) return res.status(400).json({ message: 'Address and role required' });

  try {
    const Model = role === 'NGO' ? NGO : role === 'Donor' ? Donor : null;
    if (!Model) return res.status(400).json({ message: 'Invalid role' });

    const user = await Model.findOne({ blockchainWalletAddress: address });
    if (user) {
      return res.json({ isRegistered: true });
    } else {
      return res.json({ isRegistered: false });
    }
  } catch (err) {
    console.error('Error in checkRegistration:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
