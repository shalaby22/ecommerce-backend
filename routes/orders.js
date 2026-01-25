const express = require("express");
const router = express.Router();

const {
  verifyTokenForAdmin,
  verifyToken,
} = require("../middlewares/verifytoken");

const { validate } = require("../middlewares/validateJoi");
const {
  validateNewOrder,
  validateEditOrderStatus,
} = require("../validators/orders-validator");

const {
  makeOrder,
  getUserOrders,
  getOrdersByUserId,
  getAllOrders,
  getOrderById,
  changeOrderStatusById,
} = require("../Controllers/orders.controller");

router
  .route("/")
  .post(verifyToken, validate(validateNewOrder), makeOrder)
  .get(verifyToken, getUserOrders);

router.route("/user/:userId").get(verifyTokenForAdmin, getOrdersByUserId);

router.route("/all").get(verifyTokenForAdmin, getAllOrders);

router
  .route("/:orderId")
  .get(verifyToken, getOrderById)
  .put(verifyTokenForAdmin, validate(validateEditOrderStatus),changeOrderStatusById);

module.exports = router;
