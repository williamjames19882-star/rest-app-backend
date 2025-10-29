const pool = require('../config/db');

class ReservationRepository {
  static async create(reservationData) {
    const { user_id, table_id, date, time, number_of_guests, special_requests, status = 'pending' } = reservationData;
    const [result] = await pool.execute(
      'INSERT INTO reservations (user_id, table_id, date, time, number_of_guests, special_requests, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [user_id, table_id, date, time, number_of_guests, special_requests, status]
    );
    return result.insertId;
  }

  static async getByUserId(userId) {
    const [rows] = await pool.execute(
      'SELECT r.*, t.table_number, t.capacity FROM reservations r JOIN tables t ON r.table_id = t.id WHERE r.user_id = ? ORDER BY r.date DESC, r.time DESC',
      [userId]
    );
    return rows;
  }

  static async getAll() {
    const [rows] = await pool.execute(
      `SELECT r.*, u.name as user_name, u.email, u.phone, t.table_number, t.capacity, t.location 
       FROM reservations r 
       JOIN users u ON r.user_id = u.id 
       JOIN tables t ON r.table_id = t.id 
       ORDER BY r.date DESC, r.time DESC`
    );
    return rows;
  }

  static async getAvailableTables(date, time) {
    const [rows] = await pool.execute(
      `SELECT t.* FROM tables t 
       WHERE t.id NOT IN (
         SELECT r.table_id FROM reservations r 
         WHERE r.date = ? AND r.time = ? AND r.status = 'confirmed'
       )`,
      [date, time]
    );
    return rows;
  }

  static async updateStatus(id, status) {
    const [result] = await pool.execute(
      'UPDATE reservations SET status = ? WHERE id = ?',
      [status, id]
    );
    return result.affectedRows;
  }

  static async countByTableId(tableId) {
    const [result] = await pool.execute(
      'SELECT COUNT(*) as count FROM reservations WHERE table_id = ?',
      [tableId]
    );
    return result[0].count;
  }

  static async count() {
    const [result] = await pool.execute('SELECT COUNT(*) as count FROM reservations');
    return result[0].count;
  }
}

module.exports = ReservationRepository;

