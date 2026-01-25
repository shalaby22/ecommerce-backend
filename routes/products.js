const express = require("express");
const router = express.Router();
const { verifyTokenForAdmin } = require("../middlewares/verifytoken");
const { validate } = require("../middlewares/validateJoi");
const { validateProduct } = require("../validators/products-validator");

const {
  getAllProducts,
  getProduct,
  addProduct,
  editProduct,
  deleteProduct,
} = require("../Controllers/products.controller");

router
  .route("/")
  .get(getAllProducts)
  .post(verifyTokenForAdmin, validate(validateProduct, "post"), addProduct);
router
  .route("/:id")
  .get(getProduct)
  .put(verifyTokenForAdmin, validate(validateProduct, "put"), editProduct)
  .delete(verifyTokenForAdmin, deleteProduct);

module.exports = router;
