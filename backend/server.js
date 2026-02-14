const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
require('dotenv').config();

// Initialize Express app
const app = express();

// Security Middleware
app.use(helmet()); // Set security HTTP headers

// CORS Configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate Limiting - Prevent brute force attacks
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  // Fix for X-Forwarded-For header issue
  skip: (req) => {
    // Skip rate limiting in development or if there are header issues
    return process.env.NODE_ENV === 'development';
  }
});

// Apply rate limiting to all API routes
app.use('/api/', limiter);

// Stricter rate limiting for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Increased from 5 to 50 for development
  message: 'Too many authentication attempts, please try again later.',
  skip: (req) => {
    // Skip rate limiting in development
    return process.env.NODE_ENV === 'development';
  }
});

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Data Sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data Sanitization against XSS attacks
app.use(xss());

// Prevent HTTP Parameter Pollution
app.use(hpp());

// Database Connection
console.log('🔌 Attempting to connect to MongoDB...');
console.log(`📍 Connection URL: ${process.env.MONGODB_URI.replace(/:[^:@]+@/, ':****@')}`);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
})
.then(() => {
  console.log('✅ MongoDB Connected Successfully');
  console.log(`📦 Database: ${mongoose.connection.name}`);
})
.catch(err => {
  console.error('\n❌ ═══════════════════════════════════════════════════');
  console.error('❌ MongoDB Connection FAILED');
  console.error('❌ ═══════════════════════════════════════════════════');
  console.error(`\n📋 Error: ${err.message}\n`);
  
  if (err.message.includes('ECONNREFUSED')) {
    console.error('🔍 Reason: MongoDB is not running or not installed\n');
    console.error('✅ Solutions:\n');
    console.error('   1. Install MongoDB:');
    console.error('      sudo apt-get update && sudo apt-get install -y mongodb-org');
    console.error('      sudo systemctl start mongod\n');
    console.error('   2. Or use Docker:');
    console.error('      docker run -d -p 27017:27017 --name mongodb mongo:latest\n');
    console.error('   3. Or use MongoDB Atlas (cloud):');
    console.error('      - Sign up at: https://www.mongodb.com/cloud/atlas');
    console.error('      - Update MONGODB_URI in backend/.env\n');
    console.error('📖 See MONGODB_INSTALLATION.md for detailed instructions\n');
  }
  
  console.error('⚠️  Server will continue running but login/signup will NOT work');
  console.error('⚠️  until MongoDB is connected.\n');
  console.error('═══════════════════════════════════════════════════\n');
  
  // Don't exit, let the server run so we can show error messages
  // process.exit(1);
});

// Mongoose connection event handlers
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected. Attempting to reconnect...');
});

// Routes
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/portfolios', require('./routes/portfolioRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/export', require('./routes/exportRoutes'));

// Health Check Endpoint
app.get('/api/health', async (req, res) => {
  const healthCheck = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    checks: {
      database: 'Checking...',
      memory: process.memoryUsage(),
      cpu: process.cpuUsage()
    }
  };

  try {
    // Check database connection
    await mongoose.connection.db.admin().ping();
    healthCheck.checks.database = 'OK';
  } catch (error) {
    healthCheck.checks.database = 'FAILED';
    healthCheck.status = 'DEGRADED';
  }

  const statusCode = healthCheck.status === 'OK' ? 200 : 503;
  res.status(statusCode).json(healthCheck);
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'AI-Based Portfolio Generator API',
    version: '1.0.0',
    status: 'Running',
    documentation: '/api/docs',
    health: '/api/health'
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Global Error Handler Middleware
app.use(require('./middleware/errorHandler'));

// Start Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log('');
  console.log('🚀 ═══════════════════════════════════════════════════════════');
  console.log(`   AI Portfolio Generator API Server`);
  console.log('   ═══════════════════════════════════════════════════════════');
  console.log(`   🌐 Server running on port: ${PORT}`);
  console.log(`   📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   🔗 API URL: http://localhost:${PORT}`);
  console.log(`   💚 Health Check: http://localhost:${PORT}/api/health`);
  console.log('   ═══════════════════════════════════════════════════════════');
  console.log('');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully...');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});

module.exports = app;
