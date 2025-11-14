const pool = require('../config/db');

class ContactRequestRepository {
  static async create(contactData) {
    const { name, phone, email, message } = contactData;
    const [result] = await pool.execute(
      'INSERT INTO contact_requests (name, phone, email, message) VALUES (?, ?, ?, ?)',
      [name, phone, email || null, message || null]
    );
    return result.insertId;
  }

  static async getAll(page = 1, pageSize = 25) {
    const pageNum = parseInt(page) || 1;
    const pageSizeNum = parseInt(pageSize) || 25;
    const offset = (pageNum - 1) * pageSizeNum;
    
    // Get total count
    const [countResult] = await pool.execute(
      'SELECT COUNT(*) as total FROM contact_requests'
    );
    const total = countResult[0].total;
    
    // Get paginated results
    // Note: LIMIT and OFFSET cannot use placeholders in mysql2, so we use string interpolation
    // Values are already sanitized as integers
    const [rows] = await pool.execute(
      `SELECT * FROM contact_requests ORDER BY created_at DESC LIMIT ${pageSizeNum} OFFSET ${offset}`
    );
    
    return {
      data: rows,
      pagination: {
        page: pageNum,
        pageSize: pageSizeNum,
        total,
        totalPages: Math.ceil(total / pageSizeNum)
      }
    };
  }

  static async updateStatus(id, status) {
    const [result] = await pool.execute(
      'UPDATE contact_requests SET status = ? WHERE id = ?',
      [status, id]
    );
    return result.affectedRows;
  }

  static async countByStatus(status) {
    const [result] = await pool.execute(
      'SELECT COUNT(*) as count FROM contact_requests WHERE status = ?',
      [status]
    );
    return result[0].count;
  }
}

module.exports = ContactRequestRepository;

