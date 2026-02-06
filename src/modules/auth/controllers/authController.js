const RegisterUseCase = require("../useCases/registerUseCase");
const LoginUseCase = require("../useCases/loginUseCase");
const catchAsync = require("../../../shared/utils/catchAsync");

class AuthController {
  constructor() {
    this.registerUseCase = new RegisterUseCase();
    this.loginUseCase = new LoginUseCase();
  }

  register = catchAsync(async (req, res, next) => {
    const user = await this.registerUseCase.execute(req.body);
    res.status(201).json({
      message: "Your Signed Up Successfully Please Confirm Your Email",
      data: user,
    });
  });

  login = catchAsync(async (req, res, next) => {
    const user = await this.loginUseCase.execute(req.body);
    res.status(201).json({
      message: "Login Successfully",
      data: user,
    });
  });
}

module.exports = AuthController;
