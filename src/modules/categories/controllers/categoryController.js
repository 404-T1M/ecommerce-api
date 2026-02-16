const { GetCategories } = require("@getbrevo/brevo");
const catchAsync = require("../../../shared/utils/catchAsync");
const CreateCategoryUseCase = require("../useCases/createCategoryUseCase");
const ListAllCategoriesUseCase = require("../useCases/listAllCategoriesUseCase");
const DeleteCategoryUseCase = require("../useCases/deleteCategoryUseCase");
const UpdateCategoryUseCase = require("../useCases/updateCategoryUseCase");

class CategoryController {
  constructor() {
    this.createCategoryUseCase = new CreateCategoryUseCase();
    this.listAllCategoriesUseCase = new ListAllCategoriesUseCase();
    this.deleteCategoryUseCase = new DeleteCategoryUseCase();
    this.updateCategoryUseCase = new UpdateCategoryUseCase();
  }

  createCategory = catchAsync(async (req, res, next) => {
    const loggedInUser = req.user;
    const body = req.body;
    const imageFile = req.file;

    const category = await this.createCategoryUseCase.execute(
      loggedInUser,
      body,
      imageFile,
    );
    res.status(201).json({
      message: "Category Created Successfully",
      category,
    });
  });

  adminListAllCategories = catchAsync(async (req, res, next) => {
    const loggedInUser = req.user;
    const filter = {
      name: req.query.name,
      published: req.query.published,
      parent: req.query.parent,
      fromDate: req.query.fromDate,
      toDate: req.query.toDate,
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
    };
    const result = await this.listAllCategoriesUseCase.execute(
      loggedInUser,
      filter,
    );
    res.status(200).json({
      Categories: result.data,
      meta: result.meta,
    });
  });

  usersListAllCategories = catchAsync(async (req, res, next) => {
    const loggedInUser = req.user;
    const filter = {
      name: req.query.name,
      published: true,
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
    };
    const result = await this.listAllCategoriesUseCase.execute(
      loggedInUser,
      filter,
    );
    res.status(200).json({
      categories: result.data,
      meta: result.meta,
    });
  });

  deleteCategory = catchAsync(async (req, res, next) => {
    const loggedInUser = req.user;
    const { categoryId } = req.params;
    await this.deleteCategoryUseCase.execute(loggedInUser, categoryId);
    res.status(203).json({
      message: "Category Deleted Successfully",
    });
  });

  updateCategory = catchAsync(async (req, res, next) => {
    const loggedInUser = req.user;
    const { categoryId } = req.params;
    const body = req.body;
    const imageFile = req.file;

    const category = await this.updateCategoryUseCase.execute(
      loggedInUser,
      categoryId,
      body,
      imageFile,
    );
    res.status(201).json({
      message: "Category Updated Successfully",
      category,
    });
  });
}

module.exports = CategoryController;
