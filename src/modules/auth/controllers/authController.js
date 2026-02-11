const RegisterUseCase = require("../useCases/registerUseCase");
const LoginUseCase = require("../useCases/loginUseCase");
const VerifiedEmailUseCase = require("../useCases/verifyEmailUseCase");
const ResendVerificationCodeUseCase = require("../useCases/resendVerificationCodeUseCase");
const ForgotPasswordUseCase = require("../useCases/forgotPasswordUseCase");
const ResetPasswordUseCase = require("../useCases/resetPasswordUseCase");
const AdminListUsersUseCase = require("../useCases/adminListUsersUseCase");
const GetUserDetailsUseCase = require("../useCases/getUserDetailsUseCase");
const ChangeUserStatusUseCase = require("../useCases/changeUserStatusUseCase");
const DeleteUserUseCase = require("../useCases/deleteUserUseCase");
const catchAsync = require("../../../shared/utils/catchAsync");

class AuthController {
  constructor() {
    this.registerUseCase = new RegisterUseCase();
    this.loginUseCase = new LoginUseCase();
    this.verifyEmailUseCase = new VerifiedEmailUseCase();
    this.resendVerificationCodeUseCase = new ResendVerificationCodeUseCase();
    this.forgotPasswordUseCase = new ForgotPasswordUseCase();
    this.resetPasswordUseCase = new ResetPasswordUseCase();
    this.adminListUsersUseCase = new AdminListUsersUseCase();
    this.adminListUsersUseCase = new AdminListUsersUseCase();
    this.getUserDetailsUseCase = new GetUserDetailsUseCase();
    this.changeUserStatusUseCase = new ChangeUserStatusUseCase();
    this.deleteUserUseCase = new DeleteUserUseCase();
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

  ResetPassword = catchAsync(async (req, res, next) => {
    await this.resetPasswordUseCase.execute(req);
    res.status(200).json({
      message: "Password Changed Successfully",
    });
  });

  listAllUsers = catchAsync(async (req, res, next) => {
    const user = req.user;
    const filter = {
      name: req.query.name,
      status: req.query.status,
      emailVerified: req.query.emailVerified,
      fromDate: req.query.fromDate,
      toDate: req.query.toDate,
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
    };
    const result = await this.adminListUsersUseCase.execute(user, filter);
    res.status(200).json({
      users: result.data,
      meta: result.meta,
    });
  });

  getUserDetails = catchAsync(async (req, res, next) => {
    const user = req.user;
    const { customerId } = req.params;
    const result = await this.getUserDetailsUseCase.execute(user, customerId);
    res.status(200).json({
      user: result,
    });
  });

  changeUserStatus = catchAsync(async (req, res, nex) => {
    const user = req.user;
    const { customerId } = req.params;
    const result = await this.changeUserStatusUseCase.execute(user, customerId);
    res.status(200).json({
      message: "User Status Changed Successfully",
      user: result,
    });
  });

  deleteUser = catchAsync(async (req, res, nex) => {
    const user = req.user;
    const { customerId } = req.params;
    const result = await this.deleteUserUseCase.execute(user, customerId);
    res.status(200).json({
      message: "User Deleted Successfully",
      user: result,
    });
  });
}

module.exports = AuthController;
