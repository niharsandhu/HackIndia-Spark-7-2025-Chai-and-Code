const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const ngoRoutes = require('./routes/ngoRoutes');
const app = express();

const PORT =  3002;

// Middleware
app.use(cors());
app.use(express.json());

connectDB();

// Routes
app.use('/api',ngoRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
