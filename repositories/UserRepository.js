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

  static async count() {
    const [result] = await pool.execute('SELECT COUNT(*) as count FROM users');
    return result[0].count;
  }
}

module.exports = UserRepository;

