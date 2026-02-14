const adminGroupRepository = require("../../administratorsGroup/repositories/administratorsGroupRepository");
const adminGroupResponseDTO = require("../DTO/adminGroupResponseDTO");
const {
  assertAdminPermission,
} = require("../../../core/authorization/checkAdminAndHisPermission");

class ListAdminGroupsUseCase {
  constructor() {
    this.adminGroupRepo = new adminGroupRepository();
  }
  async execute(loggedInUser) {
    await assertAdminPermission(
      loggedInUser,
      this.adminGroupRepo,
      "adminGroups.list",
    );

    const adminGroups = await this.adminGroupRepo.find();
    return {
      data: adminGroups.map((group) => new adminGroupResponseDTO(group)),
      meta: {
        total: adminGroups.length,
      },
    };
  }
}

module.exports = ListAdminGroupsUseCase;
