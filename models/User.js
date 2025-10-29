const UserRepository = require('../repositories/UserRepository');

class User {
  static async create(userData) {
    return await UserRepository.create(userData);
  }

  static async findByEmail(email) {
    return await UserRepository.findByEmail(email);
  }

  static async findById(id) {
    return await UserRepository.findById(id);
  }

  static async findAll() {
    return await UserRepository.findAll();
  }
}

module.exports = User;

