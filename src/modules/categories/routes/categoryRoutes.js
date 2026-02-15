const express = require("express");
const categoryController = require("../controllers/categoryController");
const { protect } = require("../../../middleware/protectedMiddleware");
const { restrictTo } = require("../../../middleware/roleMiddleware");
const { uploadSingle } = require("../../../middleware/uploadSingle");
const router = express.Router();
const controller = new categoryController();

router.post(
  "/admin/categories/add-category",
  protect,
  restrictTo("admin"),
  uploadSingle("categoryImage"),
  (req, res, next) => {
    controller.createCategory(req, res, next);
  },
);

module.exports = router;

// router.get("/admin/admins", protect, restrictTo("admin"), (req, res, next) => {
//   controller.listAllAdmins(req, res, next);
// });

// router.patch(
//   "/admin/admins/:adminId",
//   protect,
//   restrictTo("admin"),
//   (req, res, next) => {
//     controller.updateAdmin(req, res, next);
//   },
// );

// router.delete(
//   "/admin/admins/:adminId",
//   protect,
//   restrictTo("admin"),
//   (req, res, next) => {
//     controller.deleteAdmin(req, res, next);
//   },
// );
