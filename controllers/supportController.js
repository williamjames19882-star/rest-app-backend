const SupportTicket = require('../models/SupportTicket');

// Create support ticket
const createTicket = async (req, res) => {
  try {
    const { title, description, priority, category } = req.body;

    // Validate input
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required'
      });
    }

    // Create ticket
    const ticketId = await SupportTicket.create({
      user_id: req.user.id,
      title: title.trim(),
      description: description.trim(),
      priority: priority || 'medium',
      category: category || 'general'
    });

    // Get the created ticket
    const ticket = await SupportTicket.findById(ticketId);

    res.status(201).json({
      success: true,
      message: 'Support ticket created successfully',
      data: {
        ticket: ticket.toJSON()
      }
    });
  } catch (error) {
    console.error('Create ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create support ticket'
    });
  }
};

// Get user tickets
const getTickets = async (req, res) => {
  try {
    const { status, priority, category, search, limit, offset } = req.query;
    
    const options = {
      status: status || 'all',
      priority: priority || 'all',
      category: category || 'all',
      search: search || '',
      limit: limit ? parseInt(limit) : 50,
      offset: offset ? parseInt(offset) : 0
    };

    const tickets = await SupportTicket.findByUserId(req.user.id, options);

    res.json({
      success: true,
      data: {
        tickets: tickets.map(t => t.toJSON()),
        pagination: {
          limit: options.limit,
          offset: options.offset,
          total: tickets.length
        }
      }
    });
  } catch (error) {
    console.error('Get tickets error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve support tickets'
    });
  }
};

// Get ticket by ID
const getTicketById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const ticket = await SupportTicket.findById(id);
    
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Support ticket not found'
      });
    }

    // Check if ticket belongs to user
    if (ticket.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: {
        ticket: ticket.toJSON()
      }
    });
  } catch (error) {
    console.error('Get ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve support ticket'
    });
  }
};

// Update ticket
const updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, priority, category } = req.body;
    
    const ticket = await SupportTicket.findById(id);
    
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Support ticket not found'
      });
    }

    // Check if ticket belongs to user
    if (ticket.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check if ticket can be updated
    if (ticket.status === 'closed') {
      return res.status(400).json({
        success: false,
        message: 'Closed tickets cannot be updated'
      });
    }

    // Update ticket
    const updateData = {};
    if (title) updateData.title = title.trim();
    if (description) updateData.description = description.trim();
    if (priority) updateData.priority = priority;
    if (category) updateData.category = category;

    const updated = await SupportTicket.update(id, updateData);

    if (!updated) {
      return res.status(400).json({
        success: false,
        message: 'Failed to update ticket'
      });
    }

    // Get updated ticket
    const updatedTicket = await SupportTicket.findById(id);

    res.json({
      success: true,
      message: 'Support ticket updated successfully',
      data: {
        ticket: updatedTicket.toJSON()
      }
    });
  } catch (error) {
    console.error('Update ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update support ticket'
    });
  }
};

// Close ticket
const closeTicket = async (req, res) => {
  try {
    const { id } = req.params;
    
    const ticket = await SupportTicket.findById(id);
    
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Support ticket not found'
      });
    }

    // Check if ticket belongs to user
    if (ticket.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Update ticket status to closed
    const updated = await SupportTicket.updateStatus(id, 'closed');

    if (!updated) {
      return res.status(400).json({
        success: false,
        message: 'Failed to close ticket'
      });
    }

    // Get updated ticket
    const updatedTicket = await SupportTicket.findById(id);

    res.json({
      success: true,
      message: 'Support ticket closed successfully',
      data: {
        ticket: updatedTicket.toJSON()
      }
    });
  } catch (error) {
    console.error('Close ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to close support ticket'
    });
  }
};

// Get ticket statistics
const getTicketStats = async (req, res) => {
  try {
    const stats = await SupportTicket.getStats(req.user.id);
    
    res.json({
      success: true,
      data: {
        stats: stats
      }
    });
  } catch (error) {
    console.error('Get ticket stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve ticket statistics'
    });
  }
};

// Get all tickets (admin)
const getAllTickets = async (req, res) => {
  try {
    const { status, priority, search, limit, offset } = req.query;
    
    const options = {
      status: status || 'all',
      priority: priority || 'all',
      search: search || '',
      limit: limit ? parseInt(limit) : 50,
      offset: offset ? parseInt(offset) : 0
    };

    const tickets = await SupportTicket.findAll(options);

    res.json({
      success: true,
      data: {
        tickets: tickets.map(t => t.toJSON()),
        pagination: {
          limit: options.limit,
          offset: options.offset,
          total: tickets.length
        }
      }
    });
  } catch (error) {
    console.error('Get all tickets error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve support tickets'
    });
  }
};

// Update ticket status (admin)
const updateTicketStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const validStatuses = ['open', 'in-progress', 'resolved', 'closed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const ticket = await SupportTicket.findById(id);
    
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Support ticket not found'
      });
    }

    // Update ticket status
    const updated = await SupportTicket.updateStatus(id, status);

    if (!updated) {
      return res.status(400).json({
        success: false,
        message: 'Failed to update ticket status'
      });
    }

    // Get updated ticket
    const updatedTicket = await SupportTicket.findById(id);

    res.json({
      success: true,
      message: 'Ticket status updated successfully',
      data: {
        ticket: updatedTicket.toJSON()
      }
    });
  } catch (error) {
    console.error('Update ticket status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update ticket status'
    });
  }
};

module.exports = {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  closeTicket,
  getTicketStats,
  getAllTickets,
  updateTicketStatus
};
