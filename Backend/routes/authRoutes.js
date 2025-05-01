// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');

// 🔐 Request nonce for MetaMask login (NGO/Donor)
router.post('/request-nonce', authController.requestNonce);

// 🧾 Verify MetaMask signature for login (NGO/Donor)
router.post('/verify-signature', authController.verifySignature);

// 📝 Register any user (NGO / Donor / AidReceiver)
router.post('/register', authController.registerUser);

// 🔑 Login for AidReceiver (email-password only)
router.post('/login-aidreceiver', authController.loginAidReceiver);

router.post('/check-registration',authController.checkRegistration);

module.exports = router;
