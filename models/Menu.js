const pool = require('../config/db');

class Menu {
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
}

module.exports = Menu;

