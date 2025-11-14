const QRCode = require('../models/QRCode');

// Generate QR code
const generateQRCode = async (req, res) => {
  try {
    const { amount, currency, description } = req.body;

    // Validate input
    if (!amount || !currency) {
      return res.status(400).json({
        success: false,
        message: 'Amount and currency are required'
      });
    }

    // Validate amount
    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be greater than 0'
      });
    }

    // Create QR code
    const qrId = await QRCode.create({
      user_id: req.user.id,
      amount: parseFloat(amount),
      currency: currency.toUpperCase(),
      description: description || ''
    });

    // Get the created QR code
    const qrCode = await QRCode.findById(qrId);

    res.json({
      success: true,
      message: 'QR code generated successfully',
      data: {
        qr_code: qrCode.generateDisplayData()
      }
    });
  } catch (error) {
    console.error('QR code generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate QR code'
    });
  }
};

// Get user QR codes
const getQRCodes = async (req, res) => {
  try {
    const { active, limit, offset } = req.query;
    
    const options = {
      active: active === 'true',
      limit: limit ? parseInt(limit) : 50,
      offset: offset ? parseInt(offset) : 0
    };

    const qrCodes = await QRCode.findByUserId(req.user.id, options);

    res.json({
      success: true,
      data: {
        qr_codes: qrCodes.map(qr => qr.generateDisplayData()),
        pagination: {
          limit: options.limit,
          offset: options.offset,
          total: qrCodes.length
        }
      }
    });
  } catch (error) {
    console.error('Get QR codes error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve QR codes'
    });
  }
};

// Get QR code by ID
const getQRCodeById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const qrCode = await QRCode.findById(id);
    
    if (!qrCode) {
      return res.status(404).json({
        success: false,
        message: 'QR code not found'
      });
    }

    // Check if QR code belongs to user
    if (qrCode.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: {
        qr_code: qrCode.generateDisplayData()
      }
    });
  } catch (error) {
    console.error('Get QR code error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve QR code'
    });
  }
};

// Process QR code payment
const processQRPayment = async (req, res) => {
  try {
    const { qr_data } = req.body;

    if (!qr_data) {
      return res.status(400).json({
        success: false,
        message: 'QR data is required'
      });
    }

    // Find QR code by data
    const qrCode = await QRCode.findByQRData(qr_data);
    
    if (!qrCode) {
      return res.status(404).json({
        success: false,
        message: 'Invalid or expired QR code'
      });
    }

    // Check if QR code is already used
    if (qrCode.is_used) {
      return res.status(400).json({
        success: false,
        message: 'QR code has already been used'
      });
    }

    // Check if QR code is expired
    if (new Date() > new Date(qrCode.expires_at)) {
      return res.status(400).json({
        success: false,
        message: 'QR code has expired'
      });
    }

    // Mark QR code as used
    await QRCode.markAsUsed(qrCode.id);

    // Simulate payment processing
    const paymentResult = await simulateQRPaymentProcessing(qrCode);

    res.json({
      success: true,
      message: 'QR payment processed successfully',
      data: {
        qr_code: qrCode.generateDisplayData(),
        payment_result: paymentResult
      }
    });
  } catch (error) {
    console.error('QR payment processing error:', error);
    res.status(500).json({
      success: false,
      message: 'QR payment processing failed'
    });
  }
};

// Simulate QR payment processing
const simulateQRPaymentProcessing = async (qrCode) => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  return {
    status: 'completed',
    payment_id: `QR-${Date.now()}`,
    amount: qrCode.amount,
    currency: qrCode.currency,
    processed_at: new Date().toISOString()
  };
};

// Download QR code (placeholder)
const downloadQRCode = async (req, res) => {
  try {
    const { id } = req.params;
    
    const qrCode = await QRCode.findById(id);
    
    if (!qrCode) {
      return res.status(404).json({
        success: false,
        message: 'QR code not found'
      });
    }

    // Check if QR code belongs to user
    if (qrCode.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // In a real app, this would generate and return a QR code image
    // For now, return the QR data as text
    res.json({
      success: true,
      message: 'QR code download ready',
      data: {
        qr_data: qrCode.qr_data,
        download_url: `/api/qr/download/${id}` // Placeholder URL
      }
    });
  } catch (error) {
    console.error('Download QR code error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to prepare QR code download'
    });
  }
};

// Clean up expired QR codes
const cleanupExpiredQRCodes = async (req, res) => {
  try {
    const deletedCount = await QRCode.cleanupExpired();
    
    res.json({
      success: true,
      message: 'Expired QR codes cleaned up',
      data: {
        deleted_count: deletedCount
      }
    });
  } catch (error) {
    console.error('Cleanup QR codes error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cleanup expired QR codes'
    });
  }
};

module.exports = {
  generateQRCode,
  getQRCodes,
  getQRCodeById,
  processQRPayment,
  downloadQRCode,
  cleanupExpiredQRCodes
};
