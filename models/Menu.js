const MenuRepository = require('../repositories/MenuRepository');

class Menu {
  static async getAll() {
    return await MenuRepository.getAll();
  }

  static async getByCategory(category) {
    return await MenuRepository.getByCategory(category);
  }

  static async getById(id) {
    return await MenuRepository.getById(id);
  }

  static async create(itemData) {
    return await MenuRepository.create(itemData);
  }
}

module.exports = Menu;

