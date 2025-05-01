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
  
module.exports = {
  createCrisis
};
