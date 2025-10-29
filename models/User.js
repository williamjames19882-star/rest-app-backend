const pool = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
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
}

module.exports = User;

