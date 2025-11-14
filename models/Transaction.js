const pool = require('../config/db');

class Transaction {
  static async create(transactionData) {
    const { user_id, order_number, items, total_amount, payment_method, status = 'completed' } = transactionData;
    
    // Ensure items is properly stringified
    let itemsJson;
    if (typeof items === 'string') {
      // If it's already a string, validate it's valid JSON
      try {
        JSON.parse(items);
        itemsJson = items;
      } catch (e) {
        itemsJson = JSON.stringify(items);
      }
    } else {
      itemsJson = JSON.stringify(items);
    }
    
    const [result] = await pool.execute(
      'INSERT INTO transactions (user_id, order_number, items, total_amount, payment_method, status) VALUES (?, ?, ?, ?, ?, ?)',
      [user_id, order_number, itemsJson, total_amount, payment_method, status]
    );
    return result.insertId;
  }

  static async getByUserId(userId) {
    const [rows] = await pool.execute(
      'SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    return rows.map(row => {
      let items = row.items;
      if (typeof items === 'string') {
        try {
          items = JSON.parse(items);
        } catch (e) {
          console.error('Error parsing items JSON:', e, 'Items value:', items);
          items = [];
        }
      }
      return {
        ...row,
        items
      };
    });
  }

  static async getById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM transactions WHERE id = ?',
      [id]
    );
    if (rows[0]) {
      let items = rows[0].items;
      if (typeof items === 'string') {
        try {
          items = JSON.parse(items);
        } catch (e) {
          console.error('Error parsing items JSON:', e, 'Items value:', items);
          items = [];
        }
      }
      return {
        ...rows[0],
        items
      };
    }
    return null;
  }

  static async getAll(page = 1, pageSize = 25) {
    const pageNum = parseInt(page) || 1;
    const pageSizeNum = parseInt(pageSize) || 25;
    const offset = (pageNum - 1) * pageSizeNum;
    
    // Get total count
    const [countResult] = await pool.execute(
      'SELECT COUNT(*) as total FROM transactions'
    );
    const total = countResult[0].total;
    
    // Get paginated results
    // Note: LIMIT and OFFSET cannot use placeholders in mysql2, so we use string interpolation
    // Values are already sanitized as integers
    const [rows] = await pool.execute(
      `SELECT t.*, u.name as user_name, u.email as user_email FROM transactions t JOIN users u ON t.user_id = u.id ORDER BY t.created_at DESC LIMIT ${pageSizeNum} OFFSET ${offset}`
    );
    
    const data = rows.map(row => {
      let items = row.items;
      if (typeof items === 'string') {
        try {
          items = JSON.parse(items);
        } catch (e) {
          console.error('Error parsing items JSON:', e, 'Items value:', items);
          items = [];
        }
      }
      return {
        ...row,
        items
      };
    });
    
    return {
      data,
      pagination: {
        page: pageNum,
        pageSize: pageSizeNum,
        total,
        totalPages: Math.ceil(total / pageSizeNum)
      }
    };
  }

  static async search({ username, order_number, transaction_id, page = 1, pageSize = 25 }) {
    let whereClause = 'WHERE 1=1';
    const params = [];

    if (transaction_id) {
      whereClause += ' AND t.id = ?';
      params.push(transaction_id);
    }

    if (order_number) {
      whereClause += ' AND t.order_number LIKE ?';
      params.push(`%${order_number}%`);
    }

    if (username) {
      whereClause += ' AND (u.name LIKE ? OR u.email LIKE ?)';
      params.push(`%${username}%`, `%${username}%`);
    }

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM transactions t 
      JOIN users u ON t.user_id = u.id 
      ${whereClause}
    `;
    const [countResult] = await pool.execute(countQuery, params);
    const total = countResult[0].total;

    // Get paginated results
    const pageNum = parseInt(page) || 1;
    const pageSizeNum = parseInt(pageSize) || 25;
    const offset = (pageNum - 1) * pageSizeNum;
    // Note: LIMIT and OFFSET cannot use placeholders in mysql2, so we use string interpolation
    // Values are already sanitized as integers
    const dataQuery = `
      SELECT t.*, u.name as user_name, u.email as user_email 
      FROM transactions t 
      JOIN users u ON t.user_id = u.id 
      ${whereClause}
      ORDER BY t.created_at DESC
      LIMIT ${pageSizeNum} OFFSET ${offset}
    `;
    const [rows] = await pool.execute(dataQuery, params);
    
    const data = rows.map(row => {
      let items = row.items;
      if (typeof items === 'string') {
        try {
          items = JSON.parse(items);
        } catch (e) {
          console.error('Error parsing items JSON:', e, 'Items value:', items);
          items = [];
        }
      }
      return {
        ...row,
        items
      };
    });
    
    return {
      data,
      pagination: {
        page: pageNum,
        pageSize: pageSizeNum,
        total,
        totalPages: Math.ceil(total / pageSizeNum)
      }
    };
  }

  static generateOrderNumber() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `ORD-${timestamp}-${random}`;
  }
}

module.exports = Transaction;

