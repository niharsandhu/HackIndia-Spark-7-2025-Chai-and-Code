const Family = require('../modedls/family');
const PoaCard = require('../models/poAcard');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new family
exports.registerFamily = async (req, res) => {
  const { name, phone, address, password, district, state } = req.body;

  if (!name || !phone || !password) {
    return res.status(400).json({ message: 'Name, phone, and password are required' });
  }

  try {
    const existingFamily = await Family.findOne({ phone });
    if (existingFamily) {
      return res.status(400).json({ message: 'Family already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newFamily = new Family({
      name,
      phone,
      address,
      password: hashedPassword,
      district,
      state,
    });

    await newFamily.save();

    // Automatically create a PoA card for the new family
    const newPoaCard = new PoaCard({
      familyId: newFamily._id,
      aidHistory: [], // initially empty
    });

    await newPoaCard.save();

    res.status(201).json({ message: 'Family registered and PoA card issued' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error during registration' });
  }
};
