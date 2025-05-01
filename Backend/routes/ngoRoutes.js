const express = require('express');
const router = express.Router();
const { 
  ngoController, 
  aidController, 
  donationController, 
  userController 
} = require('../controllers/donationController');

// User routes
router.post('/users', userController.createUser);
router.get('/users/:userId', userController.getUserById);

// NGO routes
router.post('/ngos', ngoController.registerNGO);
router.put('/ngos/:ngoId/status', ngoController.updateNGOStatus);
router.get('/ngos/in-need', ngoController.getNGOsInNeed);
router.get('/ngos/:ngoId', ngoController.getNGOById);
router.get('/ngos', ngoController.getAllNGOs);

// Aid routes
router.post('/aid-cards', aidController.createAidCard);
router.post('/aid-distribution', aidController.recordAidDistribution);
router.get('/aid-distribution/:beneficiaryId', aidController.getAidDistribution);

// Donation routes
router.post('/donations', donationController.processDonation);
router.post('/fundings', donationController.fundNGO);
router.get('/donation-stats', donationController.getDonationStats);
router.get('/donations', donationController.getDonationHistory);
router.get('/fundings', donationController.getFundingHistory);

module.exports = router;