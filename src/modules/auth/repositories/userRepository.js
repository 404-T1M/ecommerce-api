const User = require("../models/userModel");

class userRepository {
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
