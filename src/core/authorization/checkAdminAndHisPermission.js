const AppError = require("../errors/appError");

exports.assertAdminPermission = async (loggedInUser, repo, permission) => {
  if (!loggedInUser) {
    throw new AppError("Unauthenticated", 401);
  }
  const adminGroupOfLoggedInAdmin = await repo.findOne({
    _id: loggedInUser.adminGroup,
  });

  if (!adminGroupOfLoggedInAdmin) {
    throw new AppError("Admin group not found", 403);
  }

  if (
    loggedInUser.role !== "admin" ||
    !adminGroupOfLoggedInAdmin.permissions.includes(permission)
  ) {
    throw new AppError("Forbidden", 403);
  }
};
