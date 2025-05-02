const express = require('express');
const router = express.Router();
const { buyAid ,getAidSummary} = require('../controllers/AidBuy'); // Make sure the path is correct

// POST /api/aids/buy
router.post('/buy', buyAid);
router.get('/aid-summary', getAidSummary);
module.exports = router;
