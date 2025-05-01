const Crisis = require('../models/Crises');
const NGO = require('../models/Ngo'); // Assuming you have the NGO model

const createCrisis = async (req, res) => {
    try {
      const {
        name,
        place,
        ngoId,
        description,
        peopleAffected,
        situationRating,
        fundsRequired,
        latitude,
        longitude
      } = req.body;
  
      // Check if the NGO ID is valid
      const ngoExists = await NGO.findById(ngoId);
      if (!ngoExists) {
        return res.status(400).json({ message: 'Invalid NGO ID.' });
      }
  
      // Create a new crisis
      const newCrisis = new Crisis({
        name,
        place,
        ngoId,
        description,
        peopleAffected,
        situationRating,
        fundsRequired,
        latitude,
        longitude
      });
  
      // Save the crisis to the database
      await newCrisis.save();
  
      return res.status(201).json({
        message: 'Crisis created successfully.',
        crisis: newCrisis
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error while creating crisis.' });
    }
  };


// Controller function to fetch all crises and their associated NGO details
const getAllCrises = async (req, res) => {
  try {
    // Fetch all crises and populate the ngoId field to get NGO details
    const crises = await Crisis.find().populate('ngoId');

    if (!crises || crises.length === 0) {
      return res.status(404).json({ message: 'No crises found' });
    }

    // Return all crises with their associated NGO details
    res.status(200).json(crises);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

  
module.exports = {
  createCrisis,getAllCrises
};
