const express = require('express');
const router = express.Router();
const qrController = require('../controllers/qrController');
const { authenticateToken } = require('../middleware/auth');

// All QR routes require authentication
router.use(authenticateToken);

// Generate QR code
router.post('/generate', qrController.generateQRCode);

// Get user QR codes
router.get('/codes', qrController.getQRCodes);

// Get QR code by ID
router.get('/codes/:id', qrController.getQRCodeById);

// Process QR payment
router.post('/process', qrController.processQRPayment);

// Download QR code
router.get('/download/:id', qrController.downloadQRCode);

// Cleanup expired QR codes
router.post('/cleanup', qrController.cleanupExpiredQRCodes);

module.exports = router;
