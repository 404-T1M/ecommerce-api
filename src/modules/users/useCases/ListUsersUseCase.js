const userRepository = require("../repositories/userRepository");
const adminGroupRepository = require("../../administratorsGroup/repositories/administratorsGroupRepository");
const {
  assertAdminPermission,
} = require("../../../core/authorization/checkAdminAndHisPermission");
const ListUserResponseDTO = require("../DTO/ListUserResponseDTO");

class adminListUsersUseCase {
  constructor() {
    this.userRepo = new userRepository();
    this.adminGroupRepo = new adminGroupRepository();
  }
  async execute(loggedInUser, filter) {
    await assertAdminPermission(
      loggedInUser,
      this.adminGroupRepo,
      "users.list",
    );

    const users = await this.userRepo.find(filter);
    return {
      data: users.map((userItem) => new ListUserResponseDTO(userItem)),
      meta: {
        total: users.length,
        page: filter.page,
        limit: filter.limit,
      },
    };
  }
}

module.exports = adminListUsersUseCase;
