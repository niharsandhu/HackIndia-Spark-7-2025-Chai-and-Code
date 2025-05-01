const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const registerRoutes= require('./routes/RegisterRoutes');
const crisisRoutes = require('./routes/crisesRoutes');
const donationRoutes = require('./routes/donationRoutes');
const app = express();

const PORT =  3002;

// Middleware
app.use(cors());
app.use(express.json());

connectDB();

app.use('/api',registerRoutes);
app.use('/api',crisisRoutes);
app.use('/api',donationRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
