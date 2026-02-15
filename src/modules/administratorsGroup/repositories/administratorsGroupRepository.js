const AdminGroup = require("../models/adminModel");

class adminRepository {
  async find() {
    return AdminGroup.find();
  }

  async findOne(filter) {
    let query = AdminGroup.findOne(filter);
    return await query;
  }

  async save(adminGroup) {
    return await AdminGroup.create(adminGroup);
  }

  async updateOne(filter, updates) {
    return await AdminGroup.findOneAndUpdate(filter, updates, {
      new: true,
      runValidators: true,
    });
  }

  async deleteOne(filter) {
    return await AdminGroup.findOneAndDelete(filter);
  }
}

module.exports = adminRepository;
