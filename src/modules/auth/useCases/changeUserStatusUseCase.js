const userRepository = require("../repositories/userRepository");
const AppError = require("../../../core/errors/appError");
const User = require("../entities/userEntity");
const AdminListUserResponseDTO = require("../DTO/authDto/adminListUserResponseDTO");

class changeUserStatusUseCase {
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
    let customer = await this.userRepo.findOne({
      id: customerId,
    });
    if (!customer) {
      throw new AppError("User Not Found", 404);
    }
    const userEntity = new User(customer);
    userEntity.deletedUser();

    customer = await this.userRepo.updateOne(
      { _id: customer.id },
      {
        status: customer.status ? false : true,
      },
    );

    return new AdminListUserResponseDTO(customer);
  }
}
module.exports = changeUserStatusUseCase;
