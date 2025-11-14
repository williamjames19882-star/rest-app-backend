const { pool } = require('../config/database');

class SupportTicket {
  constructor(ticketData) {
    this.id = ticketData.id;
    this.user_id = ticketData.user_id;
    this.title = ticketData.title;
    this.description = ticketData.description;
    this.priority = ticketData.priority;
    this.status = ticketData.status;
    this.category = ticketData.category;
    this.created_at = ticketData.created_at;
    this.updated_at = ticketData.updated_at;
  }

  // Create a new support ticket
  static async create(ticketData) {
    try {
      const { user_id, title, description, priority, category } = ticketData;
      
      const [result] = await pool.execute(
        `INSERT INTO support_tickets 
         (user_id, title, description, priority, category) 
         VALUES (?, ?, ?, ?, ?)`,
        [user_id, title, description, priority, category]
      );
      
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Find ticket by ID
  static async findById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM support_tickets WHERE id = ?',
        [id]
      );
      
      return rows.length > 0 ? new SupportTicket(rows[0]) : null;
    } catch (error) {
      throw error;
    }
  }

  // Find tickets by user ID
  static async findByUserId(userId, options = {}) {
    try {
      let query = 'SELECT * FROM support_tickets WHERE user_id = ?';
      const params = [userId];

      // Add status filter
      if (options.status && options.status !== 'all') {
        query += ' AND status = ?';
        params.push(options.status);
      }

      // Add priority filter
      if (options.priority && options.priority !== 'all') {
        query += ' AND priority = ?';
        params.push(options.priority);
      }

      // Add category filter
      if (options.category && options.category !== 'all') {
        query += ' AND category = ?';
        params.push(options.category);
      }

      // Add search filter
      if (options.search) {
        query += ' AND (title LIKE ? OR description LIKE ?)';
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
      return rows.map(row => new SupportTicket(row));
    } catch (error) {
      throw error;
    }
  }

  // Update ticket status
  static async updateStatus(id, status) {
    try {
      const [result] = await pool.execute(
        'UPDATE support_tickets SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [status, id]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Update ticket
  static async update(id, updateData) {
    try {
      const { title, description, priority, status, category } = updateData;
      
      let query = 'UPDATE support_tickets SET updated_at = CURRENT_TIMESTAMP';
      const params = [];

      if (title) {
        query += ', title = ?';
        params.push(title);
      }
      if (description) {
        query += ', description = ?';
        params.push(description);
      }
      if (priority) {
        query += ', priority = ?';
        params.push(priority);
      }
      if (status) {
        query += ', status = ?';
        params.push(status);
      }
      if (category) {
        query += ', category = ?';
        params.push(category);
      }

      query += ' WHERE id = ?';
      params.push(id);

      const [result] = await pool.execute(query, params);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Get ticket statistics
  static async getStats(userId) {
    try {
      const [rows] = await pool.execute(
        `SELECT 
           status,
           COUNT(*) as count
         FROM support_tickets 
         WHERE user_id = ? 
         GROUP BY status`,
        [userId]
      );
      
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get all tickets (admin)
  static async findAll(options = {}) {
    try {
      let query = 'SELECT t.*, u.username, u.email FROM support_tickets t JOIN users u ON t.user_id = u.id';
      const params = [];

      // Add status filter
      if (options.status && options.status !== 'all') {
        query += ' WHERE t.status = ?';
        params.push(options.status);
      }

      // Add priority filter
      if (options.priority && options.priority !== 'all') {
        const whereClause = params.length > 0 ? ' AND' : ' WHERE';
        query += `${whereClause} t.priority = ?`;
        params.push(options.priority);
      }

      // Add search filter
      if (options.search) {
        const whereClause = params.length > 0 ? ' AND' : ' WHERE';
        query += `${whereClause} (t.title LIKE ? OR t.description LIKE ? OR u.username LIKE ?)`;
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
      return rows.map(row => new SupportTicket(row));
    } catch (error) {
      throw error;
    }
  }

  // Get ticket data without sensitive information
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      priority: this.priority,
      status: this.status,
      category: this.category,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}

module.exports = SupportTicket;
