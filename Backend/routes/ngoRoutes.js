const express = require('express');
const router = express.Router();
const ngoController = require('../controllers/ngoController');

// Route to register NGO (after MetaMask login and DARPAN ID submission)
router.post('/register', ngoController.registerNgo);

// Route to get all NGOs (for admin dashboard)
router.get('/all', ngoController.getAllNgos);

// Route to approve or reject NGO (by admin)
router.post('/verify', ngoController.verifyNgo);

module.exports = router;
