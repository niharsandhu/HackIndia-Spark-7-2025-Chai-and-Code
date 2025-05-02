const express = require('express');
const router = express.Router();
const { registerNGO, registerDonor, registerAidReceiver , getAidReceiverQRCode} = require('../controllers/Register');

// Routes for registration
router.post('/register/ngo', registerNGO);
router.post('/register/donor', registerDonor);
router.post('/register/aidreceiver', registerAidReceiver);
router.get('/aidqr/:aidReceiverId', getAidReceiverQRCode); 

module.exports = router;
