const express = require('express');
const router = express.Router();
const supportController = require('../controllers/supportController');
const { authenticateToken } = require('../middleware/auth');

// All support routes require authentication
router.use(authenticateToken);

// Create support ticket
router.post('/tickets', supportController.createTicket);

// Get user tickets
router.get('/tickets', supportController.getTickets);

// Get ticket by ID
router.get('/tickets/:id', supportController.getTicketById);

// Update ticket
router.put('/tickets/:id', supportController.updateTicket);

// Close ticket
router.post('/tickets/:id/close', supportController.closeTicket);

// Get ticket statistics
router.get('/stats', supportController.getTicketStats);

// Admin routes (get all tickets)
router.get('/admin/tickets', supportController.getAllTickets);

// Admin routes (update ticket status)
router.put('/admin/tickets/:id/status', supportController.updateTicketStatus);

module.exports = router;
