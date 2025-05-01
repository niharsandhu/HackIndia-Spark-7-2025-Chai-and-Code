const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const registerRoutes= require('./routes/RegisterRoutes');
const crisisRoutes = require('./routes/crisesRoutes');
const donationRoutes = require('./routes/donationRoutes');
const aidRoutes = require('./routes/aiddist');
const aidDistRoutes = require('./routes/aidRoutes');
const app = express();

const PORT =  3002;

// Middleware
app.use(cors());
app.use(express.json());

connectDB();

app.use('/api',registerRoutes);
app.use('/api',crisisRoutes);
app.use('/api',donationRoutes);
app.use('/api',aidRoutes);
app.use('/api',aidDistRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
