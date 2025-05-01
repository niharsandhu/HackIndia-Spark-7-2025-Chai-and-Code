const express = require('express');
const router = express.Router();

// Import controller functions
const {
  sendFundsToNGO,
} = require('../controllers/donation ');


router.post('/send-funds', sendFundsToNGO);            // POST /api/donation/send-funds

module.exports = router;
