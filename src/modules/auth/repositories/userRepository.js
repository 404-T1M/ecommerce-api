const User = require("../models/userModel");

class userRepository {
  async findByEmail(email, option = {}) {
    let query = User.findOne({ email });

    if (option.withPassword) {
      query = query.select("+password");
    }

    return await query;
  }

  async save(user) {
    return await User.create(user);
  }
}

module.exports = userRepository;
