const CategoryImageRepository = require('../repositories/CategoryImageRepository');

class CategoryImage {
  static async getAll() {
    return await CategoryImageRepository.findAll();
  }

  static async getByCategory(category) {
    return await CategoryImageRepository.findByCategory(category);
  }

  static async getById(id) {
    return await CategoryImageRepository.findById(id);
  }

  static async create(data) {
    const id = await CategoryImageRepository.create(data);
    return await CategoryImageRepository.findById(id);
  }

  static async update(category, data) {
    await CategoryImageRepository.update(category, data);
    return await CategoryImageRepository.findByCategory(category);
  }

  static async delete(category) {
    return await CategoryImageRepository.delete(category);
  }
}

module.exports = CategoryImage;

