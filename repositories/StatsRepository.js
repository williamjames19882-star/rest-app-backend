const UserRepository = require('./UserRepository');
const ReservationRepository = require('./ReservationRepository');
const MenuRepository = require('./MenuRepository');
const ContactRequestRepository = require('./ContactRequestRepository');

class StatsRepository {
  static async getDashboardStats() {
    try {
      const users = await UserRepository.count();
      const reservations = await ReservationRepository.count();
      const menuItems = await MenuRepository.count();
      const newContactRequests = await ContactRequestRepository.countByStatus('new');

      return {
        users,
        reservations,
        menuItems,
        newContactRequests
      };
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      throw error;
    }
  }
}

module.exports = StatsRepository;

