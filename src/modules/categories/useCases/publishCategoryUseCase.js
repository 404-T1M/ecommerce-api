const categoryRepository = require("../repositories/categoryRepository");
const AppError = require("../../../core/errors/appError");

const {
  assertAdminPermission,
} = require("../../../core/authorization/checkAdminAndHisPermission");

class PublishCategoryUseCase {
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

    await this.categoryRepo.updateOne(
      { _id: { $in: category._id } },
      {
        published: true,
      },
    );

    // await this.productRepo.updateMany(
    //   { _id: { $in: category._id } },
    //   {
    //     published: true,
    //   },
    // );
  }
}
module.exports = PublishCategoryUseCase;
