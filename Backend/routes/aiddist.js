const express = require('express');
const router = express.Router();
const { scannerDistributeAid,getReceiverDetails} = require('../controllers/aidDist');

// POST /api/aids/distribute
router.post('/distribute', scannerDistributeAid);
router.get('/details/:receiverId',getReceiverDetails);
module.exports = router;
