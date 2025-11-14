const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { authenticateToken } = require('../middleware/auth');

// Public routes (no authentication required)
router.post('/submit', contactController.submitContactMessage);
router.get('/faq', contactController.getFAQ);

// Protected routes (authentication required)
router.use(authenticateToken);

// Get contact messages by email
router.get('/messages/:email', contactController.getContactMessages);

// Get contact message by ID
router.get('/messages/:id', contactController.getContactMessageById);

// Update contact message status
router.put('/messages/:id/status', contactController.updateContactMessageStatus);

// Admin routes (get all messages)
router.get('/admin/messages', contactController.getAllContactMessages);

// Admin routes (get statistics)
router.get('/admin/stats', contactController.getContactMessageStats);

module.exports = router;
