const Coupon = require("../models/couponModel");

class CouponRepository {
  async create(coupon) {
    return await Coupon.create(coupon);
  }

  async findOne(filter, options = {}) {
    let query = await Coupon.findOne(filter);
    if (options.populateCategories) {
      await query.populate("applicableCategories", "name");
    }
    if (options.populateProducts) {
      await query.populate("applicableProducts", "name images");
    }
    if (options.populateUsers) {
      await query.populate(
        "allowedUsers createdBy",
        "name email mobilePhone profileImage",
      );
    }
    return query;
  }

  async find(filter, sort, page, limit, options = {}) {
    let query = Coupon.find(filter).sort(sort);

    if (options.populateUsers) {
      query.populate("createdBy", "name email mobilePhone profileImage");
    }

    return await query.skip((page - 1) * limit).limit(limit);
  }

  async updateOne(filter, updates) {
    return await Coupon.findOneAndUpdate(filter, updates, {
      new: true,
      runValidators: true,
    });
  }

  async deleteOne(filter) {
    return await Coupon.findByIdAndDelete(filter);
  }
}

module.exports = CouponRepository;
