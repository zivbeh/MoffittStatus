require('dotenv').config();
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes'); // Imports from routes/index.js

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3003',      // Local frontend
    'https://www.moffittstatus.asuc.org',   // Deployed frontend
    // 'https://your-app.vercel.app' // Staging/Alternative domain
  ]
}));
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));

// Mount all routes under /api
app.use('/api', apiRoutes);

// Simple health check
app.get('/', (req, res) => {
  res.send('Library Rating API is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
