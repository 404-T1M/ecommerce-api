const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();
const controller = new authController();

router.post("/register", (req, res, next) => {
  controller.register(req, res, next);
});

router.post("/login", (req, res, next) => {
  controller.login(req, res, next);
});

router.post("/verify-email", (req, res, next) => {
  controller.verifyEmail(req, res, next);
});

router.post("/resend-verification-code", (req, res, next) => {
  controller.resendVerificationCode(req, res, next);
});

module.exports = router;
