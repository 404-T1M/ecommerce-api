const Category = require("../models/categoryModel");

class categoryRepository {
  async find() {
    return Category.find();
  }

  async findOne(filter) {
    let query = Category.findOne(filter);
    return await query;
  }

  async create(category) {
    return await Category.create(category);
  }

  async updateOne(filter, updates) {
    return await Category.findOneAndUpdate(filter, updates, {
      new: true,
      runValidators: true,
    });
  }

  async deleteOne(filter) {
    return await Category.findOneAndDelete(filter);
  }
}

module.exports = categoryRepository;
