const express = require("express");
const router = express.Router();

const { verifyAdmin, verifyToken } = require("../middlewares/verifyToken");

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
  cancelOrderById,
} = require("../Controllers/orders.controller");

router
  .route("/")
  .post(verifyToken, validate(validateNewOrder), makeOrder)
  .get(verifyToken, getUserOrders);

router.route("/user/:userId").get(verifyToken, verifyAdmin, getOrdersByUserId);

router.route("/all").get(verifyToken, verifyAdmin, getAllOrders);

router
  .route("/:orderId")
  .get(verifyToken, getOrderById)
  .put(
    verifyToken,
    verifyAdmin,
    validate(validateEditOrderStatus),
    changeOrderStatusById,
  );

router.route("/:orderId/cancel").post(verifyToken, cancelOrderById);

module.exports = router;
