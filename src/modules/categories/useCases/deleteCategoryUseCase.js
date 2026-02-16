const CategoryRepository = require("../repositories/categoryRepository");
const AppError = require("../../../core/errors/appError");
const {
  assertAdminPermission,
} = require("../../../core/authorization/checkAdminAndHisPermission");
const ImageService = require("../../../shared/services/imageUploadService");

class DeleteAdminGroupUseCase {
  constructor() {
    this.categoryRepo = new CategoryRepository();
  }

  async execute(loggedInUser, categoryId) {
    await assertAdminPermission(loggedInUser, "categories.delete");

    const category = await this.categoryRepo.findOne({ _id: categoryId });
    if (!category) {
      throw new AppError("Category not found", 404);
    }
    let categoryImageId = category.image.fileName;

    const childeCount = await this.categoryRepo.count({
      parent: categoryId,
    });

    if (childeCount > 0) {
      throw new AppError("Cannot delete category with subcategories", 409);
    }

    await this.categoryRepo.deleteOne({ _id: categoryId });
    await ImageService.delete(categoryImageId);
  }
}

module.exports = DeleteAdminGroupUseCase;
