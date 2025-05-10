require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const todoRoutes = require('./routes/todos');

const app = express();

// Improved CORS configuration
app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Test route
app.get('/api/healthcheck', (req, res) => {
  res.status(200).json({ status: 'Server is healthy' });
});

// Routes
app.use('/api/todos', todoRoutes);

// Improved server startup
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    });
    console.log('✅ Connected to MongoDB');

    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

    server.on('error', (error) => {
      console.error('❌ Server error:', error);
    });
  } catch (err) {
    console.error('❌ Fatal error:', err);
    process.exit(1);
  }
};

startServer();