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
}

module.exports = userRepository;
