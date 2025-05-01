const express = require('express');
const cors = require('cors');
const connectDB = require('./db');

const crisisRoutes = require('./routes/crisesRoutes');
const aidRoutes = require('./routes/aiddist');
const aidDistRoutes = require('./routes/aidRoutes');
const RegisterRoutes = require('./routes/RegisterRoutes');
const donateRoutes = require('./routes/donationRoute');
const loginRoutes = require('./routes/loginRoute');
const app = express();

const PORT =  3002;

// CORS Configuration
const corsOptions = {
  origin: 'http://localhost:3000', // Add your frontend URL here (for example, if you're using Next.js or React running on localhost)
  methods: ['GET', 'POST', 'PUT'], // Enable GET, POST, and PUT requests
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers like Content-Type and Authorization
  credentials: true, // Allow credentials if needed (e.g., cookies or authentication headers)
};

// Middleware
app.use(cors(corsOptions));  // Apply CORS middleware with options
app.use(express.json());

connectDB();


app.use('/api', crisisRoutes);
app.use('/api', aidRoutes);
app.use('/api', aidDistRoutes);
app.use('/api', RegisterRoutes);
app.use('/api', donateRoutes);
app.use('/api', loginRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
