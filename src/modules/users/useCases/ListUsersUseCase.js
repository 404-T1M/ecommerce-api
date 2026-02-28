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
    await assertAdminPermission(loggedInUser, "users.list");

    const [users, total] = await Promise.all([
      this.userRepo.find(filter),
      this.userRepo.count(filter),
    ]);
    return {
      data: users.map((userItem) => new ListUserResponseDTO(userItem)),
      meta: {
        total,
        page: filter.page,
        limit: filter.limit,
        totalPages: Math.ceil(total / filter.limit),
      },
    };
  }
}

module.exports = adminListUsersUseCase;
