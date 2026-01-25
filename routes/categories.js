const express = require("express");
const router = express.Router();
const { verifyTokenForAdmin } = require("../middlewares/verifytoken");
const { validate } = require("../middlewares/validateJoi");
const { validateCategory } = require("../validators/categories-validator");

const {
  getAllCategories,
  getCategory,
  getProductsOfCategory,
  addCategory,
  editCategory,
  deleteCategory,
} = require("../Controllers/categories.controller");

router
  .route("/")
  .get(getAllCategories)
  .post(verifyTokenForAdmin, validate(validateCategory, "post"), addCategory);

router
  .route("/:id")
  .get(getCategory)
  .put(verifyTokenForAdmin,validate(validateCategory, "put"), editCategory)
  .delete(verifyTokenForAdmin, deleteCategory);

router.route("/:id/products").get(getProductsOfCategory);

module.exports = router;
