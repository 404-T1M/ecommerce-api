const catchAsync = require("../../../shared/utils/catchAsync");
const CreateCategoryUseCase = require("../useCases/createCategoryUseCase");

class CategoryController {
  constructor() {
    this.createCategoryUseCase = new CreateCategoryUseCase();
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
}

module.exports = CategoryController;
