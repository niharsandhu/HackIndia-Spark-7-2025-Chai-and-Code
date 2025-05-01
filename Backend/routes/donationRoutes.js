const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donation ');

// POST route for creating a new crisis
router.post('/donate',donationController.sendFundsToNGO);

module.exports = router;
