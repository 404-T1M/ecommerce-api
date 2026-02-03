const User = require("../models/userModel");

class userRepository {
  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async save(user) {
    return await User.create(user);
  }
}

module.exports = userRepository;
