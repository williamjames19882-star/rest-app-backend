const pool = require('../config/db');

class CategoryImageRepository {
  static async findAll() {
    const [rows] = await pool.execute(
      'SELECT id, category, image_url, public_id, created_at, updated_at FROM category_images ORDER BY category ASC'
    );
    return rows;
  }

  static async findByCategory(category) {
    const [rows] = await pool.execute(
      'SELECT * FROM category_images WHERE category = ?',
      [category]
    );
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM category_images WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async create({ category, image_url, public_id }) {
    const [result] = await pool.execute(
      'INSERT INTO category_images (category, image_url, public_id) VALUES (?, ?, ?)',
      [category, image_url, public_id || null]
    );
    return result.insertId;
  }

  static async update(category, { image_url, public_id }) {
    const [result] = await pool.execute(
      'UPDATE category_images SET image_url = ?, public_id = ?, updated_at = CURRENT_TIMESTAMP WHERE category = ?',
      [image_url, public_id || null, category]
    );
    return result.affectedRows;
  }

  static async delete(category) {
    const [result] = await pool.execute(
      'DELETE FROM category_images WHERE category = ?',
      [category]
    );
    return result.affectedRows;
  }
}

module.exports = CategoryImageRepository;

