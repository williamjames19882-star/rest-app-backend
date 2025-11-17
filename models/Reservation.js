const ReservationRepository = require('../repositories/ReservationRepository');

class Reservation {
  static async create(reservationData) {
    return await ReservationRepository.create(reservationData);
  }

  static async getByUserId(userId) {
    return await ReservationRepository.getByUserId(userId);
  }


  static async getById(id) {
    return await ReservationRepository.findById(id);
  }
}

module.exports = Reservation;

