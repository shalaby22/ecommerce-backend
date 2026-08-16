const express = require("express");
const router = express.Router();
const {
  verifyAdmin,
  verifyToken,
} = require("../middlewares/verifyToken");
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
  .post(verifyToken , verifyAdmin, validate(validateCategory, "post"), addCategory);

router
  .route("/:id")
  .get(getCategory)
  .put(verifyToken , verifyAdmin,validate(validateCategory, "put"), editCategory)
  .delete(verifyToken , verifyAdmin, deleteCategory);

router.route("/:id/products").get(getProductsOfCategory);

module.exports = router;
