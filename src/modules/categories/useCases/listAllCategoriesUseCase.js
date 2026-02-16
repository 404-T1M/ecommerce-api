const CategoryRepository = require("../repositories/categoryRepository");
const CategoryDataResponseDTO = require("../DTO/categoryDataResponseDTO");
const {
  assertAdminPermission,
} = require("../../../core/authorization/checkAdminAndHisPermission");

class ListAllCategoriesUseCase {
  constructor() {
    this.categoryRepo = new CategoryRepository();
  }

  async execute(loggedInUser, filter) {
    if (loggedInUser && loggedInUser.role === "admin") {
      await assertAdminPermission(loggedInUser, "categories.list");
    }

    const [categories, total] = await Promise.all([
      this.categoryRepo.find(filter, {
        populateParent: true,
        populateCreatedBy: true,
      }),
      this.categoryRepo.count(filter),
    ]);
    return {
      data: categories.map((category) => new CategoryDataResponseDTO(category)),
      meta: {
        total,
        page: filter.page,
        limit: filter.limit,
        totalPages: Math.ceil(total / filter.limit),
      },
    };
  }
}

module.exports = ListAllCategoriesUseCase;
