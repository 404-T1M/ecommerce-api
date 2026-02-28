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

    const query = {};

    if (filter.published !== undefined) {
      query.published = filter.published;
    }

    if (filter.isDeleted !== undefined) {
      query.isDeleted = filter.isDeleted;
    }

    if (filter.name) {
      query.$or = [
        { "name.en": { $regex: filter.name, $options: "i" } },
        { "name.ar": { $regex: filter.name, $options: "i" } },
      ];
    }

    if (filter.parent) {
      query.parent = filter.parent;
    }

    if (filter.fromDate || filter.toDate) {
      query.createdAt = {};
      if (filter.fromDate) query.createdAt.$gte = new Date(filter.fromDate);
      if (filter.toDate) query.createdAt.$lte = new Date(filter.toDate);
    }

    const [categories, total] = await Promise.all([
      this.categoryRepo.find(query, {
        page: filter.page,
        limit: filter.limit,
        populateParent: true,
        populateCreatedBy: true,
        populateAttributes: true,
      }),
      this.categoryRepo.count(query),
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
