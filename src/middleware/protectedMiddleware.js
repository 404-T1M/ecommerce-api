const jwt = require("jsonwebtoken");
const catchAsync = require("../shared/utils/catchAsync");
const AppError = require("../core/errors/appError");
const userRepository = require("../modules/users/repositories/userRepository");

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access", 401),
    );
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return next(new AppError("Invalid or expired token", 401));
  }

  const userRepo = new userRepository();
  const currentUser = await userRepo.findOne({ _id: decoded.id });

  if (!currentUser) {
    return next(new AppError("User no longer exists", 401));
  }

  if (currentUser.tokenVersion !== decoded.tokenVersion) {
    return next(new AppError("Token is no longer valid", 401));
  }

  req.user = currentUser;
  next();
});
