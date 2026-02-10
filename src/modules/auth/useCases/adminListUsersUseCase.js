const userRepository = require("../repositories/userRepository");
const AppError = require("../../../core/errors/appError");
const AdminListUserResponseDTO = require("../DTO/authDto/adminListUserResponseDTO");

class adminListUsersUseCase {
  constructor() {
    this.userRepo = new userRepository();
  }
  async execute(user, filter) {
    if (user.role !== "superAdmin") {
      throw new AppError("Your Not Allowed To This", 403);
    }
    const users = await this.userRepo.find(filter);
    return users.map((userItem) => new AdminListUserResponseDTO(userItem));
  }
}

module.exports = adminListUsersUseCase;
