const RegisterUseCase = require("../useCases/registerUseCase");
const catchAsync = require("../../../shared/utils/catchAsync");

class AuthController {
  constructor() {
    this.registerUseCase = new RegisterUseCase();
  }

  register = catchAsync(async (req, res, next) => {
    const user = await this.registerUseCase.execute(req.body);
    res.status(201).json({
      message: "Your Signed Up Successfully Please Confirm Your Email",
      data: user,
    });
  });
}

module.exports = AuthController;
