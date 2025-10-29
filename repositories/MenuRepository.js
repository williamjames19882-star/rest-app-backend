const pool = require('../config/db');

class MenuRepository {
  static async getAll() {
    const [rows] = await pool.execute(
      'SELECT * FROM menu_items ORDER BY category, name'
    );
    return rows;
  }

  static async getByCategory(category) {
    const [rows] = await pool.execute(
      'SELECT * FROM menu_items WHERE category = ? ORDER BY name',
      [category]
    );
    return rows;
  }

  static async getById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM menu_items WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async create(itemData) {
    const { name, description, price, category, image_url } = itemData;
    const [result] = await pool.execute(
      'INSERT INTO menu_items (name, description, price, category, image_url) VALUES (?, ?, ?, ?, ?)',
      [name, description, price, category, image_url]
    );
    return result.insertId;
  }

  static async update(id, itemData) {
    const { name, description, price, category, image_url } = itemData;
    const [result] = await pool.execute(
      'UPDATE menu_items SET name = ?, description = ?, price = ?, category = ?, image_url = ? WHERE id = ?',
      [name, description, price, category, image_url, id]
    );
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await pool.execute(
      'DELETE FROM menu_items WHERE id = ?',
      [id]
    );
    return result.affectedRows;
  }

  static async getImageUrl(id) {
    const [rows] = await pool.execute(
      'SELECT image_url FROM menu_items WHERE id = ?',
      [id]
    );
    return rows[0]?.image_url;
  }

  static async count() {
    const [result] = await pool.execute('SELECT COUNT(*) as count FROM menu_items');
    return result[0].count;
  }
}

module.exports = MenuRepository;

