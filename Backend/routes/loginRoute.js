const express = require('express');
const router = express.Router();
const {
  loginNGO,
  loginDonor,
  loginAidReceiver,
} = require('../controllers/login'); // Make sure the path is correct to your controller



// Login Routes
router.post('/login/ngo', loginNGO); // Login NGO
router.post('/login/donor', loginDonor); // Login Donor
router.post('/login/aidReceiver', loginAidReceiver); // Login Aid Receiver

module.exports = router;
