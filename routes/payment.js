const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticateToken } = require('../middleware/auth');

// All payment routes require authentication
router.use(authenticateToken);

// Payment processing
router.post('/process', paymentController.processPayment);

// Get user transactions
router.get('/transactions', paymentController.getTransactions);

// Get transaction by ID
router.get('/transactions/:id', paymentController.getTransactionById);

// Get transaction statistics
router.get('/stats', paymentController.getTransactionStats);

// Refund transaction
router.post('/transactions/:id/refund', paymentController.refundTransaction);

module.exports = router;
