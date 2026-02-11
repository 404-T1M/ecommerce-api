const userRepository = require("../repositories/userRepository");
const AppError = require("../../../core/errors/appError");
const User = require("../entities/userEntity");
const AdminListUserResponseDTO = require("../DTO/authDto/adminListUserResponseDTO");

class getUserDetailsUseCase {
  constructor() {
    this.userRepo = new userRepository();
  }
  async execute(user, customerId) {
    if (!user) {
      throw new AppError("Unauthenticated", 401);
    }

    if (user.role !== "superAdmin") {
      throw new AppError("Your Not Allowed To This", 403);
    }

    const result = await this.userRepo.findOne({ id: customerId });

    if (!result) {
      throw new AppError("User Not Found", 404);
    }
    
    const userEntity = new User(result);
    userEntity.deletedUser();

    return new AdminListUserResponseDTO(result);
  }
}

module.exports = getUserDetailsUseCase;
