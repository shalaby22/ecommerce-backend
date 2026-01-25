const express = require("express");
const router = express.Router();
const {
  verifyAdmin,
  verifyToken,
} = require("../middlewares/verifytoken");
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
  .post(verifyToken , verifyAdmin, validate(validateProduct, "post"), addProduct);
router
  .route("/:id")
  .get(getProduct)
  .put(verifyToken , verifyAdmin, validate(validateProduct, "put"), editProduct)
  .delete(verifyToken , verifyAdmin, deleteProduct);

module.exports = router;
