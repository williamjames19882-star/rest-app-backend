const pool = require('../config/db');

class Address {
  static async create(addressData) {
    const { user_id, address_line1, address_line2, city, postal_code, country = 'UK', is_default = false } = addressData;
    
    // If this is set as default, unset other default addresses
    if (is_default) {
      await pool.execute(
        'UPDATE user_addresses SET is_default = FALSE WHERE user_id = ?',
        [user_id]
      );
    }
    
    const [result] = await pool.execute(
      'INSERT INTO user_addresses (user_id, address_line1, address_line2, city, postal_code, country, is_default) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [user_id, address_line1, address_line2 || null, city, postal_code, country, is_default]
    );
    
    return result.insertId;
  }

  static async getByUserId(userId) {
    const [rows] = await pool.execute(
      'SELECT * FROM user_addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC',
      [userId]
    );
    return rows;
  }

  static async getById(id, userId) {
    const [rows] = await pool.execute(
      'SELECT * FROM user_addresses WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return rows[0] || null;
  }

  static async update(id, userId, addressData) {
    const { address_line1, address_line2, city, postal_code, country = 'UK', is_default = false } = addressData;
    
    // If this is set as default, unset other default addresses
    if (is_default) {
      await pool.execute(
        'UPDATE user_addresses SET is_default = FALSE WHERE user_id = ? AND id != ?',
        [userId, id]
      );
    }
    
    const [result] = await pool.execute(
      'UPDATE user_addresses SET address_line1 = ?, address_line2 = ?, city = ?, postal_code = ?, country = ?, is_default = ? WHERE id = ? AND user_id = ?',
      [address_line1, address_line2 || null, city, postal_code, country, is_default, id, userId]
    );
    
    return result.affectedRows > 0;
  }

  static async delete(id, userId) {
    const [result] = await pool.execute(
      'DELETE FROM user_addresses WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    
    return result.affectedRows > 0;
  }

  static async setDefault(id, userId) {
    // Unset all defaults for this user
    await pool.execute(
      'UPDATE user_addresses SET is_default = FALSE WHERE user_id = ?',
      [userId]
    );
    
    // Set this address as default
    const [result] = await pool.execute(
      'UPDATE user_addresses SET is_default = TRUE WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    
    return result.affectedRows > 0;
  }
}

module.exports = Address;

