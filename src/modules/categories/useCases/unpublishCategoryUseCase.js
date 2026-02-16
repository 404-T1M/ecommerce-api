const categoryRepository = require("../repositories/categoryRepository");
const AppError = require("../../../core/errors/appError");
const {
  assertAdminPermission,
} = require("../../../core/authorization/checkAdminAndHisPermission");

class UnpublishCategoryUseCase {
  constructor() {
    this.categoryRepo = new categoryRepository();
  }
  async execute(loggedInUser, categoryId) {
    await assertAdminPermission(loggedInUser, "categories.update");

    const category = await this.categoryRepo.findOne({
      _id: categoryId,
    });
    if (!category) {
      throw new AppError("Category Not Found", 404);
    }

    const childrenIds = await this.categoryRepo.findChildrenIds(categoryId);
    const allCategoryIds = [categoryId, ...childrenIds];

    await this.categoryRepo.updateMany(
      { _id: { $in: allCategoryIds } },
      {
        published: false,
      },
    );

    // await this.productRepo.updateMany(
    //   { _id: { $in: allCategoryIds } },
    //   {
    //     published: false,
    //   },
    // );
  }
}
module.exports = UnpublishCategoryUseCase;
