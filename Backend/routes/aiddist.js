const express = require('express');
const router = express.Router();
const { scannerDistributeAid} = require('../controllers/aidDist');

// POST /api/aids/distribute
router.post('/distribute', scannerDistributeAid);

module.exports = router;
