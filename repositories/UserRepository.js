const pool = require('../config/db');
const bcrypt = require('bcryptjs');

class UserRepository {
  static async create(userData) {
    const { name, email, password, phone, role = 'user' } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, phone, role]
    );
    
    return result.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT id, name, email, phone, role FROM users WHERE id = ?',
      [id]
    );
    
    return rows[0];
  }

  static async findAll() {
    const [rows] = await pool.execute(
      'SELECT id, name, email, phone, role, created_at FROM users ORDER BY created_at DESC'
    );
    
    return rows;
  }

  static async getAll(page = 1, pageSize = 25) {
    const pageNum = parseInt(page) || 1;
    const pageSizeNum = parseInt(pageSize) || 25;
    const offset = (pageNum - 1) * pageSizeNum;

    // Get total count
    const [countResult] = await pool.execute('SELECT COUNT(*) as total FROM users');
    const total = countResult[0].total;

    // Get paginated data
    const [rows] = await pool.execute(
      `SELECT id, name, email, phone, role, created_at 
       FROM users 
       ORDER BY created_at DESC 
       LIMIT ${pageSizeNum} OFFSET ${offset}`
    );

    return {
      data: rows,
      pagination: {
        page: pageNum,
        pageSize: pageSizeNum,
        total: total,
        totalPages: Math.ceil(total / pageSizeNum)
      }
    };
  }

  static async search(searchTerm) {
    const [rows] = await pool.execute(
      `SELECT id, name, email, phone, role, created_at 
       FROM users 
       WHERE name LIKE ? OR email LIKE ? 
       ORDER BY created_at DESC`,
      [`%${searchTerm}%`, `%${searchTerm}%`]
    );
    
    return rows;
  }

  static async searchWithPagination(searchTerm, page = 1, pageSize = 25) {
    const pageNum = parseInt(page) || 1;
    const pageSizeNum = parseInt(pageSize) || 25;
    const offset = (pageNum - 1) * pageSizeNum;

    // Get total count
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total 
       FROM users 
       WHERE name LIKE ? OR email LIKE ?`,
      [`%${searchTerm}%`, `%${searchTerm}%`]
    );
    const total = countResult[0].total;

    // Get paginated data
    const [rows] = await pool.execute(
      `SELECT id, name, email, phone, role, created_at 
       FROM users 
       WHERE name LIKE ? OR email LIKE ? 
       ORDER BY created_at DESC 
       LIMIT ${pageSizeNum} OFFSET ${offset}`,
      [`%${searchTerm}%`, `%${searchTerm}%`]
    );

    return {
      data: rows,
      pagination: {
        page: pageNum,
        pageSize: pageSizeNum,
        total: total,
        totalPages: Math.ceil(total / pageSizeNum)
      }
    };
  }

  static async count() {
    const [result] = await pool.execute('SELECT COUNT(*) as count FROM users');
    return result[0].count;
  }
}

module.exports = UserRepository;

