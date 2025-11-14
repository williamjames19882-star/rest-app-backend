const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const { authenticateToken } = require('../middleware/auth');

// Create a new transaction (order)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { items, total_amount, payment_method } = req.body;
    const user_id = req.user.userId;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items are required' });
    }

    if (!total_amount || total_amount <= 0) {
      return res.status(400).json({ error: 'Valid total amount is required' });
    }

    if (!payment_method) {
      return res.status(400).json({ error: 'Payment method is required' });
    }

    const order_number = Transaction.generateOrderNumber();

    const transactionId = await Transaction.create({
      user_id,
      order_number,
      items,
      total_amount,
      payment_method,
      status: 'completed'
    });

    // Fetch the created transaction
    let transaction;
    try {
      transaction = await Transaction.getById(transactionId);
    } catch (fetchError) {
      console.error('Error fetching created transaction:', fetchError);
      // Return success even if fetch fails, as transaction was created
      transaction = {
        id: transactionId,
        order_number,
        items,
        total_amount,
        payment_method,
        status: 'completed'
      };
    }

    res.status(201).json({
      message: 'Transaction created successfully',
      transaction
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

// Get user's transaction history
router.get('/my-transactions', authenticateToken, async (req, res) => {
  try {
    const user_id = req.user.userId;
    const transactions = await Transaction.getByUserId(user_id);
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Get a specific transaction by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.userId;
    
    const transaction = await Transaction.getById(id);
    
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // Ensure user can only access their own transactions (unless admin)
    if (transaction.user_id !== user_id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(transaction);
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({ error: 'Failed to fetch transaction' });
  }
});

module.exports = router;

