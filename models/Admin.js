const UserRepository = require('../repositories/UserRepository');
const MenuRepository = require('../repositories/MenuRepository');
const ReservationRepository = require('../repositories/ReservationRepository');
const ContactRequestRepository = require('../repositories/ContactRequestRepository');
const StatsRepository = require('../repositories/StatsRepository');

class Admin {
  // User management
  static async getAllUsers(search, page = 1, pageSize = 25) {
    if (search) {
      return await UserRepository.searchWithPagination(search, page, pageSize);
    }
    return await UserRepository.getAll(page, pageSize);
  }

  // Menu management
  static async createMenuItem(itemData) {
    const itemId = await MenuRepository.create(itemData);
    return await MenuRepository.getById(itemId);
  }

  static async updateMenuItem(id, itemData) {
    const affectedRows = await MenuRepository.update(id, itemData);
    if (affectedRows === 0) {
      return null;
    }
    return await MenuRepository.getById(id);
  }

  static async deleteMenuItem(id) {
    return await MenuRepository.delete(id);
  }

  static async getMenuItemImageUrl(id) {
    const item = await MenuRepository.getById(id);
    return item?.image_url || null;
  }

  static async getMenuItemById(id) {
    return await MenuRepository.getById(id);
  }

  // Reservation management
  static async getAllReservations(page = 1, pageSize = 25) {
    return await ReservationRepository.getAll(page, pageSize);
  }

  static async updateReservationStatus(id, status) {
    return await ReservationRepository.updateStatus(id, status);
  }


  // Contact request management
  static async getAllContactRequests(page = 1, pageSize = 25) {
    return await ContactRequestRepository.getAll(page, pageSize);
  }

  static async updateContactRequestStatus(id, status) {
    return await ContactRequestRepository.updateStatus(id, status);
  }

  // Statistics
  static async getDashboardStats() {
    return await StatsRepository.getDashboardStats();
  }

}

module.exports = Admin;

