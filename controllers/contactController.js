const ContactMessage = require('../models/ContactMessage');

// Submit contact message
const submitContactMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message, inquiry_type } = req.body;

    // Validate input
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Create contact message
    const messageId = await ContactMessage.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : null,
      subject: subject ? subject.trim() : null,
      message: message.trim(),
      inquiry_type: inquiry_type || 'general'
    });

    // Get the created message
    const contactMessage = await ContactMessage.findById(messageId);

    res.status(201).json({
      success: true,
      message: 'Contact message submitted successfully',
      data: {
        message: contactMessage.toJSON()
      }
    });
  } catch (error) {
    console.error('Submit contact message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit contact message'
    });
  }
};

// Get contact messages by email
const getContactMessages = async (req, res) => {
  try {
    const { email } = req.params;
    const { status, inquiry_type, limit, offset } = req.query;
    
    const options = {
      status: status || 'all',
      inquiry_type: inquiry_type || 'all',
      limit: limit ? parseInt(limit) : 50,
      offset: offset ? parseInt(offset) : 0
    };

    const messages = await ContactMessage.findByEmail(email, options);

    res.json({
      success: true,
      data: {
        messages: messages.map(m => m.toJSON()),
        pagination: {
          limit: options.limit,
          offset: options.offset,
          total: messages.length
        }
      }
    });
  } catch (error) {
    console.error('Get contact messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve contact messages'
    });
  }
};

// Get contact message by ID
const getContactMessageById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const message = await ContactMessage.findById(id);
    
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    res.json({
      success: true,
      data: {
        message: message.toJSON()
      }
    });
  } catch (error) {
    console.error('Get contact message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve contact message'
    });
  }
};

// Update contact message status
const updateContactMessageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const validStatuses = ['new', 'in-progress', 'resolved'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const message = await ContactMessage.findById(id);
    
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    // Update message status
    const updated = await ContactMessage.updateStatus(id, status);

    if (!updated) {
      return res.status(400).json({
        success: false,
        message: 'Failed to update message status'
      });
    }

    // Get updated message
    const updatedMessage = await ContactMessage.findById(id);

    res.json({
      success: true,
      message: 'Message status updated successfully',
      data: {
        message: updatedMessage.toJSON()
      }
    });
  } catch (error) {
    console.error('Update contact message status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update message status'
    });
  }
};

// Get all contact messages (admin)
const getAllContactMessages = async (req, res) => {
  try {
    const { status, inquiry_type, search, limit, offset } = req.query;
    
    const options = {
      status: status || 'all',
      inquiry_type: inquiry_type || 'all',
      search: search || '',
      limit: limit ? parseInt(limit) : 50,
      offset: offset ? parseInt(offset) : 0
    };

    const messages = await ContactMessage.findAll(options);

    res.json({
      success: true,
      data: {
        messages: messages.map(m => m.toJSON()),
        pagination: {
          limit: options.limit,
          offset: options.offset,
          total: messages.length
        }
      }
    });
  } catch (error) {
    console.error('Get all contact messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve contact messages'
    });
  }
};

// Get contact message statistics
const getContactMessageStats = async (req, res) => {
  try {
    const stats = await ContactMessage.getStats();
    
    res.json({
      success: true,
      data: {
        stats: stats
      }
    });
  } catch (error) {
    console.error('Get contact message stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve contact message statistics'
    });
  }
};

// Get FAQ data
const getFAQ = async (req, res) => {
  try {
    const faqData = [
      {
        id: 1,
        question: 'How do I reset my password?',
        answer: 'Click on "Forgot Password" on the login page and follow the instructions sent to your email.'
      },
      {
        id: 2,
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, Apple Pay, and bank transfers.'
      },
      {
        id: 3,
        question: 'How long does it take to process payments?',
        answer: 'Most payments are processed instantly. Some may take up to 24 hours depending on the payment method.'
      },
      {
        id: 4,
        question: 'Is my payment information secure?',
        answer: 'Yes, we use 256-bit SSL encryption and are PCI DSS compliant to ensure your data is always secure.'
      },
      {
        id: 5,
        question: 'Can I get a refund?',
        answer: 'Refunds are processed within 3-5 business days. Contact support for assistance with refund requests.'
      },
      {
        id: 6,
        question: 'How do I generate a QR code for payment?',
        answer: 'Go to the QR Pay section, enter the amount and description, then click "Generate QR Code".'
      },
      {
        id: 7,
        question: 'What should I do if a payment fails?',
        answer: 'Check your card details and try again. If the problem persists, contact our support team.'
      },
      {
        id: 8,
        question: 'How can I track my transactions?',
        answer: 'Use the Pay Status section to view all your transactions with search and filter options.'
      }
    ];

    res.json({
      success: true,
      data: {
        faq: faqData
      }
    });
  } catch (error) {
    console.error('Get FAQ error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve FAQ data'
    });
  }
};

module.exports = {
  submitContactMessage,
  getContactMessages,
  getContactMessageById,
  updateContactMessageStatus,
  getAllContactMessages,
  getContactMessageStats,
  getFAQ
};
