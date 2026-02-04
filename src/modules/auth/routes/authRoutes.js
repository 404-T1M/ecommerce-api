const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();
const controller = new authController();

router.post("/register", (req, res, next) => {
  controller.register(req, res, next);
});

module.exports = router;
