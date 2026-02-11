const express = require("express");
const authController = require("../controllers/authController");
const { protect } = require("../../../middleware/protectedMiddleware");
const { restrictTo } = require("../../../middleware/roleMiddleware");

const router = express.Router();
const controller = new authController();

router.post("auth/register", (req, res, next) => {
  controller.register(req, res, next);
});

router.post("/auth/login", (req, res, next) => {
  controller.login(req, res, next);
});

router.post("/auth/verify-email", (req, res, next) => {
  controller.verifyEmail(req, res, next);
});

router.post("auth/resend-verification-code", (req, res, next) => {
  controller.resendVerificationCode(req, res, next);
});

router.post("auth/forgot-password", (req, res, next) => {
  controller.forgotPassword(req, res, next);
});

router.patch("auth/reset-password/:token", (req, res, next) => {
  controller.ResetPassword(req, res, next);
});

router.get(
  "/admin/users",
  protect,
  restrictTo("superAdmin"),
  (req, res, next) => {
    controller.listAllUsers(req, res, next);
  },
);

router.get(
  "/admin/users/:userId",
  protect,
  restrictTo("superAdmin"),
  (req, res, next) => {
    controller.getUserDetails(req, res, next);
  },
);

router.patch(
  "/admin/users/:userId/update-status",
  protect,
  restrictTo("superAdmin"),
  (req, res, next) => {
    controller.changeUserStatus(req, res, next);
  },
);

router.delete(
  "/admin/users/:userId/delete",
  protect,
  restrictTo("superAdmin"),
  (req, res, next) => {
    controller.deleteUser(req, res, next);
  },
);

module.exports = router;
