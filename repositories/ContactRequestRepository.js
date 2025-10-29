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

  static async getAll() {
    const [rows] = await pool.execute(
      'SELECT * FROM contact_requests ORDER BY created_at DESC'
    );
    return rows;
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

