const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://ai-code-mentor-rose.vercel.app',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true
}));
app.use(express.json());

// Logger
const logger = require('./middleware/logger');
app.use(logger);

// Rate Limiters
const { chatRateLimiter, authRateLimiter } = require('./middleware/rateLimiter');

// Routes
const authRoutes = require('./routes/auth');
app.use('/auth', authRateLimiter, authRoutes);

const chatRoutes = require('./routes/chat');
app.use('/api/chat', chatRateLimiter, chatRoutes);

const sessionRoutes = require('./routes/sessions');
app.use('/api/sessions', sessionRoutes);

// Health Check Route
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    environment: process.env.NODE_ENV || 'development',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// Centralized Error Handler
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

// Database Connection
async function startServer() {
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('MongoDB Atlas connected');
    } else {
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log('MongoDB Memory Server connected');
      process.on('SIGINT', async () => {
        await mongoose.disconnect();
        await mongod.stop();
        process.exit(0);
      });
    }

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error('Server startup error:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app;
