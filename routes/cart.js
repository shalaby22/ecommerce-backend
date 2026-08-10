const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middlewares/verifytoken");

const { validate } = require("../middlewares/validateJoi");

const {
  validateAddCart,
  validateMergeCart,
} = require("../validators/cart-validator");

const {
  addItemToCart,
  getCart,
  deleteCart,
  deleteProductFromCart,
  editProductFromCart,
  mergeItemsToCart,
} = require("../Controllers/cart.controller");

router
  .route("/add")
  .post(verifyToken, validate(validateAddCart, "post"), addItemToCart);

router
  .route("/merge")
  .post(verifyToken, validate(validateMergeCart), mergeItemsToCart);

router.route("/").get(verifyToken, getCart).delete(verifyToken, deleteCart);

router
  .route("/:productId")
  .delete(verifyToken, deleteProductFromCart)
  .put(verifyToken, validate(validateAddCart, "put"), editProductFromCart);

module.exports = router;
