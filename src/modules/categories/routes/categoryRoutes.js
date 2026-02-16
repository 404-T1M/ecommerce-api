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

router.get(
  "/admin/categories",
  protect,
  restrictTo("admin"),
  (req, res, next) => {
    controller.adminListAllCategories(req, res, next);
  },
);

router.get("/categories", (req, res, next) => {
  controller.usersListAllCategories(req, res, next);
});

router.delete(
  "/admin/categories/:categoryId/delete",
  protect,
  restrictTo("admin"),
  (req, res, next) => {
    controller.deleteCategory(req, res, next);
  },
);

module.exports = router;

// router.patch(
//   "/admin/admins/:adminId",
//   protect,
//   restrictTo("admin"),
//   (req, res, next) => {
//     controller.updateAdmin(req, res, next);
//   },
// );
