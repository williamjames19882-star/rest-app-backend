const ReservationRepository = require('../repositories/ReservationRepository');

class Reservation {
  static async create(reservationData) {
    return await ReservationRepository.create(reservationData);
  }

  static async getByUserId(userId) {
    return await ReservationRepository.getByUserId(userId);
  }

  static async getAvailableTables(date, time) {
    return await ReservationRepository.getAvailableTables(date, time);
  }
}

module.exports = Reservation;

