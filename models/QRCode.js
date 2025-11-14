const { pool } = require('../config/database');
const crypto = require('crypto');

class QRCode {
  constructor(qrData) {
    this.id = qrData.id;
    this.user_id = qrData.user_id;
    this.amount = qrData.amount;
    this.currency = qrData.currency;
    this.description = qrData.description;
    this.qr_data = qrData.qr_data;
    this.is_used = qrData.is_used;
    this.expires_at = qrData.expires_at;
    this.created_at = qrData.created_at;
  }

  // Create a new QR code
  static async create(qrData) {
    try {
      const { user_id, amount, currency, description } = qrData;
      
      // Generate QR data
      const qrDataString = `NaniCCP:${amount}:${currency}:${description}:${Date.now()}`;
      const qrHash = crypto.createHash('sha256').update(qrDataString).digest('hex');
      
      // Set expiration time (24 hours from now)
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);
      
      const [result] = await pool.execute(
        `INSERT INTO qr_codes 
         (user_id, amount, currency, description, qr_data, expires_at) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [user_id, amount, currency, description, qrHash, expiresAt]
      );
      
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Find QR code by ID
  static async findById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM qr_codes WHERE id = ?',
        [id]
      );
      
      return rows.length > 0 ? new QRCode(rows[0]) : null;
    } catch (error) {
      throw error;
    }
  }

  // Find QR codes by user ID
  static async findByUserId(userId, options = {}) {
    try {
      let query = 'SELECT * FROM qr_codes WHERE user_id = ?';
      const params = [userId];

      // Add active filter (not expired and not used)
      if (options.active) {
        query += ' AND is_used = FALSE AND expires_at > NOW()';
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
      return rows.map(row => new QRCode(row));
    } catch (error) {
      throw error;
    }
  }

  // Find QR code by QR data
  static async findByQRData(qrData) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM qr_codes WHERE qr_data = ? AND is_used = FALSE AND expires_at > NOW()',
        [qrData]
      );
      
      return rows.length > 0 ? new QRCode(rows[0]) : null;
    } catch (error) {
      throw error;
    }
  }

  // Mark QR code as used
  static async markAsUsed(id) {
    try {
      const [result] = await pool.execute(
        'UPDATE qr_codes SET is_used = TRUE WHERE id = ?',
        [id]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Clean up expired QR codes
  static async cleanupExpired() {
    try {
      const [result] = await pool.execute(
        'DELETE FROM qr_codes WHERE expires_at < NOW() OR is_used = TRUE'
      );
      
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  }

  // Generate QR code data for display
  generateDisplayData() {
    return {
      id: this.id,
      amount: this.amount,
      currency: this.currency,
      description: this.description,
      qr_data: this.qr_data,
      is_used: this.is_used,
      expires_at: this.expires_at,
      created_at: this.created_at,
      is_expired: new Date() > new Date(this.expires_at)
    };
  }

  // Get QR code data without sensitive information
  toJSON() {
    return {
      id: this.id,
      amount: this.amount,
      currency: this.currency,
      description: this.description,
      qr_data: this.qr_data,
      is_used: this.is_used,
      expires_at: this.expires_at,
      created_at: this.created_at
    };
  }
}

module.exports = QRCode;
