const UserRepository = require('../repositories/UserRepository');

class Auth {
  static async signup(userData) {
    const userId = await UserRepository.create(userData);
    const user = await UserRepository.findById(userId);
    return user;
  }

  static async login(email) {
    return await UserRepository.findByEmail(email);
  }
}

module.exports = Auth;

