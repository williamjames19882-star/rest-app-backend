const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { testConnection } = require('./config/database');
const authRoutes = require('./routes/auth');
const paymentRoutes = require('./routes/payment');
const qrRoutes = require('./routes/qr');
const supportRoutes = require('./routes/support');
const contactRoutes = require('./routes/contact');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test database connection on startup
testConnection();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/qr', qrRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/contact', contactRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Auth endpoints:`);
  console.log(`   POST http://localhost:${PORT}/api/auth/register`);
  console.log(`   POST http://localhost:${PORT}/api/auth/login`);
  console.log(`   GET  http://localhost:${PORT}/api/auth/profile`);
  console.log(`   POST http://localhost:${PORT}/api/auth/logout`);
  console.log(`💳 Payment endpoints:`);
  console.log(`   POST http://localhost:${PORT}/api/payment/process`);
  console.log(`   GET  http://localhost:${PORT}/api/payment/transactions`);
  console.log(`   GET  http://localhost:${PORT}/api/payment/stats`);
  console.log(`📱 QR Code endpoints:`);
  console.log(`   POST http://localhost:${PORT}/api/qr/generate`);
  console.log(`   GET  http://localhost:${PORT}/api/qr/codes`);
  console.log(`   POST http://localhost:${PORT}/api/qr/process`);
  console.log(`🎫 Support endpoints:`);
  console.log(`   POST http://localhost:${PORT}/api/support/tickets`);
  console.log(`   GET  http://localhost:${PORT}/api/support/tickets`);
  console.log(`📞 Contact endpoints:`);
  console.log(`   POST http://localhost:${PORT}/api/contact/submit`);
  console.log(`   GET  http://localhost:${PORT}/api/contact/faq`);
});

module.exports = app;
