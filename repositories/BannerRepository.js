const pool = require('../config/db');

class BannerRepository {
  static async findAllActive() {
    const [rows] = await pool.execute(
      'SELECT id, title, subtitle, image_url, is_active, position FROM banners WHERE is_active = 1 ORDER BY position ASC, id DESC'
    );
    return rows;
  }

  static async findAll() {
    const [rows] = await pool.execute(
      'SELECT id, title, subtitle, image_url, is_active, position, created_at FROM banners ORDER BY position ASC, id DESC'
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM banners WHERE id = ?',[id]
    );
    return rows[0];
  }

  static async create({ title, subtitle, image_url, public_id, is_active = 1, position = 0 }) {
    const [result] = await pool.execute(
      'INSERT INTO banners (title, subtitle, image_url, public_id, is_active, position) VALUES (?, ?, ?, ?, ?, ?)',
      [title || null, subtitle || null, image_url, public_id || null, is_active, position]
    );
    return result.insertId;
  }

  static async update(id, { title, subtitle, image_url, public_id, is_active, position }) {
    const [result] = await pool.execute(
      'UPDATE banners SET title = ?, subtitle = ?, image_url = ?, public_id = ?, is_active = ?, position = ? WHERE id = ?',
      [title || null, subtitle || null, image_url, public_id || null, is_active ? 1 : 0, position || 0, id]
    );
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await pool.execute('DELETE FROM banners WHERE id = ?', [id]);
    return result.affectedRows;
  }
}

module.exports = BannerRepository;


