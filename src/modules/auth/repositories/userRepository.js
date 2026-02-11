const User = require("../models/userModel");

class userRepository {
  async find(filters) {
    const query = { role: "user", isDeleted: false };

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.name) {
      query.name = { $regex: filters.name, $options: "i" };
    }

    if (filters.emailVerified) {
      query.emailVerified = filters.emailVerified;
    }

    if (filters.fromDate || filters.toDate) {
      query.createdAt = {};
      if (filters.fromDate) {
        query.createdAt.$gte = new Date(filters.fromDate);
      }
      if (filters.toDate) {
        query.createdAt.$lte = new Date(filters.toDate);
      }
    }

    return User.find(query)
      .skip((filters.page - 1) * filters.limit)
      .limit(filters.limit);
  }
  async findOne(filter, options = {}) {
    let query = User.findOne(filter);

    if (options.withPassword) {
      query = query.select("+password");
    }

    if (options.withVerificationCode) {
      query = query.select("+verificationCode");
    }

    if (options.withResetPasswordToken) {
      query = query.select("+resetPasswordToken");
    }

    return await query;
  }

  async findByEmail(email, options = {}) {
    return this.findOne({ email }, options);
  }

  async findByPhone(mobilePhone, options = {}) {
    return this.findOne({ mobilePhone }, options);
  }

  async save(user) {
    return await User.create(user);
  }

  async updateOne(filter, updates) {
    return await User.findOneAndUpdate(filter, updates, {
      new: true,
      runValidators: true,
    });
  }
}

module.exports = userRepository;
