const BannerRepository = require('../repositories/BannerRepository');

class Banner {
  static async getActive() {
    return await BannerRepository.findAllActive();
  }

  static async getAll() {
    return await BannerRepository.findAll();
  }

  static async getById(id) {
    return await BannerRepository.findById(id);
  }

  static async create(data) {
    const id = await BannerRepository.create(data);
    return await BannerRepository.findById(id);
  }

  static async update(id, data) {
    await BannerRepository.update(id, data);
    return await BannerRepository.findById(id);
  }

  static async delete(id) {
    return await BannerRepository.delete(id);
  }
}

module.exports = Banner;


