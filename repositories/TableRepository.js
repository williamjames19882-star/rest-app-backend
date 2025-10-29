const pool = require('../config/db');

class TableRepository {
  static async getAll() {
    const [rows] = await pool.execute(
      'SELECT * FROM tables ORDER BY table_number ASC'
    );
    return rows;
  }

  static async getById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM tables WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async create(tableData) {
    const { table_number, capacity, location } = tableData;
    const [result] = await pool.execute(
      'INSERT INTO tables (table_number, capacity, location) VALUES (?, ?, ?)',
      [table_number, capacity, location || '']
    );
    return result.insertId;
  }

  static async update(id, tableData) {
    const { table_number, capacity, location } = tableData;
    const [result] = await pool.execute(
      'UPDATE tables SET table_number = ?, capacity = ?, location = ? WHERE id = ?',
      [table_number, capacity, location || '', id]
    );
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await pool.execute(
      'DELETE FROM tables WHERE id = ?',
      [id]
    );
    return result.affectedRows;
  }
}

module.exports = TableRepository;

