const RegisterUseCase = require("../useCases/registerUseCase");
const LoginUseCase = require("../useCases/loginUseCase");
const VerifiedEmailUseCase = require("../useCases/verifyEmailUseCase");
const ResendVerificationCodeUseCase = require("../useCases/resendVerificationCodeUseCase");
const ForgotPasswordUseCase = require("../useCases/forgotPasswordUseCase");
const catchAsync = require("../../../shared/utils/catchAsync");

class AuthController {
  constructor() {
    this.registerUseCase = new RegisterUseCase();
    this.loginUseCase = new LoginUseCase();
    this.verifyEmailUseCase = new VerifiedEmailUseCase();
    this.resendVerificationCodeUseCase = new ResendVerificationCodeUseCase();
    this.forgotPasswordUseCase = new ForgotPasswordUseCase();
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
    res.status(200).json({
      message: "Login Successfully",
      data: user,
    });
  });

  verifyEmail = catchAsync(async (req, res, next) => {
    await this.verifyEmailUseCase.execute(req.body);
    res.status(200).json({
      message: "Email Verified Successfully",
    });
  });

  resendVerificationCode = catchAsync(async (req, res, next) => {
    await this.resendVerificationCodeUseCase.execute(req.body);
    res.status(200).json({
      message: "Verification Code Was Send Successfully Check Your Email",
    });
  });

  forgotPassword = catchAsync(async (req, res, next) => {
    await this.forgotPasswordUseCase.execute(req.body);
    res.status(200).json({
      message: "Reset Password Link Was Send Successfully Check Your Email",
    });
  });
}

module.exports = AuthController;
