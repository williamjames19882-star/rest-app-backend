const UserRepository = require('../repositories/UserRepository');
const MenuRepository = require('../repositories/MenuRepository');
const ReservationRepository = require('../repositories/ReservationRepository');
const TableRepository = require('../repositories/TableRepository');
const ContactRequestRepository = require('../repositories/ContactRequestRepository');
const StatsRepository = require('../repositories/StatsRepository');

class Admin {
  // User management
  static async getAllUsers(search) {
    if (search) {
      return await UserRepository.search(search);
    }
    return await UserRepository.findAll();
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
  static async getAllReservations() {
    return await ReservationRepository.getAll();
  }

  static async updateReservationStatus(id, status) {
    return await ReservationRepository.updateStatus(id, status);
  }

  // Table management
  static async getAllTables() {
    return await TableRepository.getAll();
  }

  static async createTable(tableData) {
    const tableId = await TableRepository.create(tableData);
    return await TableRepository.getById(tableId);
  }

  static async updateTable(id, tableData) {
    const affectedRows = await TableRepository.update(id, tableData);
    if (affectedRows === 0) {
      return null;
    }
    return await TableRepository.getById(id);
  }

  static async deleteTable(id) {
    return await TableRepository.delete(id);
  }

  static async getTableById(id) {
    return await TableRepository.getById(id);
  }

  // Contact request management
  static async getAllContactRequests() {
    return await ContactRequestRepository.getAll();
  }

  static async updateContactRequestStatus(id, status) {
    return await ContactRequestRepository.updateStatus(id, status);
  }

  // Statistics
  static async getDashboardStats() {
    return await StatsRepository.getDashboardStats();
  }

  // Helper methods
  static async checkTableHasReservations(tableId) {
    const count = await ReservationRepository.countByTableId(tableId);
    return count > 0;
  }
}

module.exports = Admin;

