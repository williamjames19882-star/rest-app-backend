const pool = require('../config/db');

class Reservation {
  static async create(reservationData) {
    const { user_id, table_id, date, time, number_of_guests, special_requests } = reservationData;
    const [result] = await pool.execute(
      'INSERT INTO reservations (user_id, table_id, date, time, number_of_guests, special_requests, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [user_id, table_id, date, time, number_of_guests, special_requests, 'confirmed']
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

  static async getAvailableTables(date, time) {
    const [rows] = await pool.execute(
      `SELECT t.* FROM tables t 
       WHERE t.id NOT IN (
         SELECT r.table_id FROM reservations r 
         WHERE r.date = ? AND r.time = ? AND r.status = 'confirmed'
       )`
      , [date, time]
    );
    return rows;
  }
}

module.exports = Reservation;

