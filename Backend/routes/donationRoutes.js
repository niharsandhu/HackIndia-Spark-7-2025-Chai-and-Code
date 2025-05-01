const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donation ');

// POST route for creating a new crisis
router.post('/sendFundsToNGO/:ngoId', donationController.sendFundsToNGO);
router.get('/ngos', donationController.getAllNgos);

module.exports = router;
