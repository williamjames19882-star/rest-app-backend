const { pool } = require('../config/database');

class ContactMessage {
  constructor(messageData) {
    this.id = messageData.id;
    this.name = messageData.name;
    this.email = messageData.email;
    this.phone = messageData.phone;
    this.subject = messageData.subject;
    this.message = messageData.message;
    this.inquiry_type = messageData.inquiry_type;
    this.status = messageData.status;
    this.created_at = messageData.created_at;
  }

  // Create a new contact message
  static async create(messageData) {
    try {
      const { name, email, phone, subject, message, inquiry_type } = messageData;
      
      const [result] = await pool.execute(
        `INSERT INTO contact_messages 
         (name, email, phone, subject, message, inquiry_type) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [name, email, phone, subject, message, inquiry_type]
      );
      
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Find message by ID
  static async findById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM contact_messages WHERE id = ?',
        [id]
      );
      
      return rows.length > 0 ? new ContactMessage(rows[0]) : null;
    } catch (error) {
      throw error;
    }
  }

  // Find messages by email
  static async findByEmail(email, options = {}) {
    try {
      let query = 'SELECT * FROM contact_messages WHERE email = ?';
      const params = [email];

      // Add status filter
      if (options.status && options.status !== 'all') {
        query += ' AND status = ?';
        params.push(options.status);
      }

      // Add inquiry type filter
      if (options.inquiry_type && options.inquiry_type !== 'all') {
        query += ' AND inquiry_type = ?';
        params.push(options.inquiry_type);
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
      return rows.map(row => new ContactMessage(row));
    } catch (error) {
      throw error;
    }
  }

  // Update message status
  static async updateStatus(id, status) {
    try {
      const [result] = await pool.execute(
        'UPDATE contact_messages SET status = ? WHERE id = ?',
        [status, id]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Get all messages (admin)
  static async findAll(options = {}) {
    try {
      let query = 'SELECT * FROM contact_messages';
      const params = [];

      // Add status filter
      if (options.status && options.status !== 'all') {
        query += ' WHERE status = ?';
        params.push(options.status);
      }

      // Add inquiry type filter
      if (options.inquiry_type && options.inquiry_type !== 'all') {
        const whereClause = params.length > 0 ? ' AND' : ' WHERE';
        query += `${whereClause} inquiry_type = ?`;
        params.push(options.inquiry_type);
      }

      // Add search filter
      if (options.search) {
        const whereClause = params.length > 0 ? ' AND' : ' WHERE';
        query += `${whereClause} (name LIKE ? OR email LIKE ? OR subject LIKE ? OR message LIKE ?)`;
        const searchTerm = `%${options.search}%`;
        params.push(searchTerm, searchTerm, searchTerm, searchTerm);
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
      return rows.map(row => new ContactMessage(row));
    } catch (error) {
      throw error;
    }
  }

  // Get message statistics
  static async getStats() {
    try {
      const [rows] = await pool.execute(
        `SELECT 
           status,
           inquiry_type,
           COUNT(*) as count
         FROM contact_messages 
         GROUP BY status, inquiry_type`
      );
      
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get message data without sensitive information
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      phone: this.phone,
      subject: this.subject,
      message: this.message,
      inquiry_type: this.inquiry_type,
      status: this.status,
      created_at: this.created_at
    };
  }
}

module.exports = ContactMessage;
