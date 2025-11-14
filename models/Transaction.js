const { pool } = require('../config/database');

class Transaction {
  constructor(transactionData) {
    this.id = transactionData.id;
    this.user_id = transactionData.user_id;
    this.amount = transactionData.amount;
    this.currency = transactionData.currency;
    this.payment_method = transactionData.payment_method;
    this.status = transactionData.status;
    this.reference = transactionData.reference;
    this.card_number_last4 = transactionData.card_number_last4;
    this.cardholder_name = transactionData.cardholder_name;
    this.description = transactionData.description;
    this.created_at = transactionData.created_at;
    this.updated_at = transactionData.updated_at;
  }

  // Create a new transaction
  static async create(transactionData) {
    try {
      const { 
        user_id, 
        amount, 
        currency, 
        payment_method, 
        card_number_last4, 
        cardholder_name, 
        description 
      } = transactionData;
      
      // Generate unique reference
      const reference = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      
      const [result] = await pool.execute(
        `INSERT INTO transactions 
         (user_id, amount, currency, payment_method, reference, card_number_last4, cardholder_name, description) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [user_id, amount, currency, payment_method, reference, card_number_last4, cardholder_name, description]
      );
      
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Find transaction by ID
  static async findById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM transactions WHERE id = ?',
        [id]
      );
      
      return rows.length > 0 ? new Transaction(rows[0]) : null;
    } catch (error) {
      throw error;
    }
  }

  // Find transactions by user ID
  static async findByUserId(userId, options = {}) {
    try {
      let query = 'SELECT * FROM transactions WHERE user_id = ?';
      const params = [userId];

      // Add status filter
      if (options.status && options.status !== 'all') {
        query += ' AND status = ?';
        params.push(options.status);
      }

      // Add search filter
      if (options.search) {
        query += ' AND (reference LIKE ? OR payment_method LIKE ?)';
        const searchTerm = `%${options.search}%`;
        params.push(searchTerm, searchTerm);
      }

      // Add ordering
      query += ' ORDER BY created_at DESC';

      // Add pagination
      if (options.limit) {
        query += ' LIMIT ?';
        params.push(options.limit);
        
        if (options.offset) {
          query += ' OFFSET ?';
          params.push(options.offset);
        }
      }

      const [rows] = await pool.execute(query, params);
      return rows.map(row => new Transaction(row));
    } catch (error) {
      throw error;
    }
  }

  // Update transaction status
  static async updateStatus(id, status) {
    try {
      const [result] = await pool.execute(
        'UPDATE transactions SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [status, id]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Get transaction statistics
  static async getStats(userId) {
    try {
      const [rows] = await pool.execute(
        `SELECT 
           status,
           COUNT(*) as count,
           SUM(amount) as total_amount
         FROM transactions 
         WHERE user_id = ? 
         GROUP BY status`,
        [userId]
      );
      
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get transaction by reference
  static async findByReference(reference) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM transactions WHERE reference = ?',
        [reference]
      );
      
      return rows.length > 0 ? new Transaction(rows[0]) : null;
    } catch (error) {
      throw error;
    }
  }

  // Get all transactions (admin)
  static async findAll(options = {}) {
    try {
      let query = 'SELECT t.*, u.username, u.email FROM transactions t JOIN users u ON t.user_id = u.id';
      const params = [];

      // Add status filter
      if (options.status && options.status !== 'all') {
        query += ' WHERE t.status = ?';
        params.push(options.status);
      }

      // Add search filter
      if (options.search) {
        const whereClause = params.length > 0 ? ' AND' : ' WHERE';
        query += `${whereClause} (t.reference LIKE ? OR t.payment_method LIKE ? OR u.username LIKE ?)`;
        const searchTerm = `%${options.search}%`;
        params.push(searchTerm, searchTerm, searchTerm);
      }

      // Add ordering
      query += ' ORDER BY t.created_at DESC';

      // Add pagination
      if (options.limit) {
        query += ' LIMIT ?';
        params.push(options.limit);
        
        if (options.offset) {
          query += ' OFFSET ?';
          params.push(options.offset);
        }
      }

      const [rows] = await pool.execute(query, params);
      return rows.map(row => new Transaction(row));
    } catch (error) {
      throw error;
    }
  }

  // Get transaction data without sensitive information
  toJSON() {
    return {
      id: this.id,
      amount: this.amount,
      currency: this.currency,
      payment_method: this.payment_method,
      status: this.status,
      reference: this.reference,
      card_number_last4: this.card_number_last4,
      cardholder_name: this.cardholder_name,
      description: this.description,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}

module.exports = Transaction;
