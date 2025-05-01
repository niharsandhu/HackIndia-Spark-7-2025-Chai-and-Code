const express = require('express');
const router = express.Router();
const { buyAid } = require('../controllers/AidBuy'); // Make sure the path is correct

// POST /api/aids/buy
router.post('/buy', buyAid);

module.exports = router;
