const userRepository = require("../repositories/userRepository");
const AppError = require("../../../core/errors/appError");
const User = require("../entities/userEntity");
const ListUserResponseDTO = require("../DTO/ListUserResponseDTO");

class getUserDetailsUseCase {
  constructor() {
    this.userRepo = new userRepository();
  }
  async execute(user, userId) {
    if (!user) {
      throw new AppError("Unauthenticated", 401);
    }

    if (user.role !== "admin") {
      throw new AppError("Your Not Allowed To This", 403);
    }
    const result = await this.userRepo.findOne({ _id: userId });

    if (!result) {
      throw new AppError("User Not Found", 404);
    }

    const userEntity = new User(result);
    userEntity.deletedUser();

    return new ListUserResponseDTO(result);
  }
}

module.exports = getUserDetailsUseCase;
