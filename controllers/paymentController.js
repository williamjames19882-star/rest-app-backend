const Transaction = require('../models/Transaction');

// Process payment
const processPayment = async (req, res) => {
  try {
    const { 
      amount, 
      currency, 
      payment_method, 
      card_number, 
      cardholder_name, 
      description 
    } = req.body;

    // Validate input
    if (!amount || !currency || !payment_method || !card_number || !cardholder_name) {
      return res.status(400).json({
        success: false,
        message: 'All payment fields are required'
      });
    }

    // Validate amount
    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be greater than 0'
      });
    }

    // Extract last 4 digits of card number
    const cardNumberLast4 = card_number.slice(-4);

    // Create transaction
    const transactionId = await Transaction.create({
      user_id: req.user.id,
      amount: parseFloat(amount),
      currency: currency.toUpperCase(),
      payment_method: payment_method,
      card_number_last4: cardNumberLast4,
      cardholder_name: cardholder_name,
      description: description || ''
    });

    // Get the created transaction
    const transaction = await Transaction.findById(transactionId);

    // Simulate payment processing (in real app, integrate with payment gateway)
    const processingResult = await simulatePaymentProcessing(transaction);

    // Update transaction status based on processing result
    await Transaction.updateStatus(transactionId, processingResult.status);

    // Get updated transaction
    const updatedTransaction = await Transaction.findById(transactionId);

    res.json({
      success: true,
      message: 'Payment processed successfully',
      data: {
        transaction: updatedTransaction.toJSON(),
        processing_result: processingResult
      }
    });
  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment processing failed'
    });
  }
};

// Simulate payment processing (replace with real payment gateway integration)
const simulatePaymentProcessing = async (transaction) => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Simulate success/failure based on amount (for demo purposes)
  const isSuccess = transaction.amount < 1000; // Fail if amount >= 1000

  return {
    status: isSuccess ? 'completed' : 'failed',
    gateway_response: isSuccess ? 'Payment approved' : 'Payment declined',
    transaction_id: `GW-${Date.now()}`,
    processed_at: new Date().toISOString()
  };
};

// Get user transactions
const getTransactions = async (req, res) => {
  try {
    const { status, search, limit, offset } = req.query;
    
    const options = {
      status: status || 'all',
      search: search || '',
      limit: limit ? parseInt(limit) : 50,
      offset: offset ? parseInt(offset) : 0
    };

    const transactions = await Transaction.findByUserId(req.user.id, options);

    res.json({
      success: true,
      data: {
        transactions: transactions.map(t => t.toJSON()),
        pagination: {
          limit: options.limit,
          offset: options.offset,
          total: transactions.length
        }
      }
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve transactions'
    });
  }
};

// Get transaction by ID
const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const transaction = await Transaction.findById(id);
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Check if transaction belongs to user
    if (transaction.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: {
        transaction: transaction.toJSON()
      }
    });
  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve transaction'
    });
  }
};

// Get transaction statistics
const getTransactionStats = async (req, res) => {
  try {
    const stats = await Transaction.getStats(req.user.id);
    
    res.json({
      success: true,
      data: {
        stats: stats
      }
    });
  } catch (error) {
    console.error('Get transaction stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve transaction statistics'
    });
  }
};

// Refund transaction
const refundTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    
    const transaction = await Transaction.findById(id);
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Check if transaction belongs to user
    if (transaction.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check if transaction can be refunded
    if (transaction.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Only completed transactions can be refunded'
      });
    }

    // Simulate refund processing
    const refundResult = await simulateRefundProcessing(transaction);

    // Update transaction status
    await Transaction.updateStatus(id, refundResult.status);

    // Get updated transaction
    const updatedTransaction = await Transaction.findById(id);

    res.json({
      success: true,
      message: 'Refund processed successfully',
      data: {
        transaction: updatedTransaction.toJSON(),
        refund_result: refundResult
      }
    });
  } catch (error) {
    console.error('Refund transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Refund processing failed'
    });
  }
};

// Simulate refund processing
const simulateRefundProcessing = async (transaction) => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  return {
    status: 'refunded',
    refund_id: `REF-${Date.now()}`,
    refunded_amount: transaction.amount,
    processed_at: new Date().toISOString()
  };
};

module.exports = {
  processPayment,
  getTransactions,
  getTransactionById,
  getTransactionStats,
  refundTransaction
};
