const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const ngoRoutes = require('./routes/ngoRoutes');
const donationController = require('./controllers/donationController');
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

connectDB();

// Routes
app.use('/api/ngo',ngoRoutes);
app.use('/api/donations', donationController);
// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
