const express = require('express');
const router = express.Router();
const { createCrisis } = require('../controllers/Crises'); // Make sure the path is correct

// POST route for creating a new crisis
router.post('/create', createCrisis);

module.exports = router;
