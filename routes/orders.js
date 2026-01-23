const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");

const { User } = require("../models/users-model");
const { Product } = require("../models/products-model");
const {
  Order,
  validateNewOrder,
  validateEditOrderStatus,
} = require("../models/orders-model");

const {
  verifyTokenForAdmin,
  verifyToken,
} = require("../middlewares/verifytoken");

const { FailError } = require("../middlewares/errors");
const { verifyCartProducts } = require("../utils/verifyCartProducts");
const isValidObjectId = require("../utils/isValidObjectId");
/**

 * @decs  make an order
 * @route /api/orders
 * @method post
 * @access auth  
 */

router.route("/").post(
  verifyToken,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate({
      path: "cart.product",
      select: "name price stock",
    });

    const { edited } = verifyCartProducts(user.cart);

    if (edited) {
      throw new FailError("your cart contains invalid product", 400);
    }

    if (!user.cart[0]) {
      throw new FailError("your cart is empty", 400);
    }
    const { error } = validateNewOrder(req.body);

    if (error) {
      throw new FailError(error.details[0].message, 400);
    }

    const addressIndex = req.body.addressIndex;

    if (!user.addresses[+addressIndex]) {
      throw new FailError("this address index is empty", 400);
    }
    const paymentIndex = req.body.paymentIndex;
    if (!user.payments[+paymentIndex]) {
      throw new FailError("this payment index is empty", 400);
    }

    //todo separate stock validation in a function below

    let items = [];
    for (let i = 0; i < user.cart.length; i++) {
      const myProduct = await Product.findById(user.cart[i].product._id);
      if (!myProduct) {
        throw new FailError(
          `didn't find that product index ${user.cart[i].product}`,
          404,
        );
      } else if (myProduct.stock < user.cart[i].quantity) {
        throw new FailError(
          `the stock is not enough for that product ${user.cart[i].product}`,
          400,
        );
      } else {
        items[i] = {
          product: user.cart[i].product,
          quantity: user.cart[i].quantity,
          price: user.cart[i].product.price,
        };
      }
    }
    const total = user.cartPrice();

    //todo add payment verification
    const newOrder = new Order({
      user: req.user._id,
      items: items,
      shippingAddress: user.addresses[+addressIndex],
      total: total,
      //status: req.body.status,
    });

    const saved = await newOrder.save();

    user.cart = [];
    await user.save();

    return res.status(200).json({
      status: "success",
      data: { order: saved },
    });
  }),
);

/**

 * @decs  get orders
 * @route /api/orders
 * @method get
 * @access auth  
 */

router.route("/").get(
  verifyToken,
  asyncHandler(async (req, res) => {
    const myOrders = await Order.find({ user: req.user._id });
    return res.status(200).json({
      status: "success",
      data: { orders: myOrders },
    });
  }),
);

/**

 * @decs  get orders by userId
 * @route /api/orders/user/:userId
 * @method get
 * @access admin only  
 */

router.route("/user/:userId").get(
  verifyTokenForAdmin,
  asyncHandler(async (req, res) => {
    if (!isValidObjectId(req.params.userId)) {
      throw new FailError("that is not a valid userId", 400);
    }
    const orders = await Order.find({ user: req.params.userId });
    return res.status(200).json({
      status: "success",
      data: { orders: orders },
    });
  }),
);

/**

 * @decs  get all orders
 * @route /api/orders/all
 * @method get
 * @access admin only  
 */

router.route("/all").get(
  verifyTokenForAdmin,
  asyncHandler(async (req, res) => {
    const orders = await Order.find();
    return res.status(200).json({
      status: "success",
      data: { orders: orders },
    });
  }),
);

/**

 * @decs  get a single order
 * @route /api/orders/:orderId
 * @method get
 * @access auth or admin 
 */

router.route("/:orderId").get(
  verifyToken,
  asyncHandler(async (req, res) => {
    if (!isValidObjectId(req.params.orderId)) {
      throw new FailError("that is not a valid orderId", 400);
    }
    const myOrder = await Order.findById(req.params.orderId);
    if (!myOrder) {
      throw new FailError("didn't find that order", 404);
    }
    if (myOrder.user == req.user._id || req.user.isAdmin) {
      return res.status(200).json({
        status: "success",
        data: { order: myOrder },
      });
    } else {
      throw new FailError("not allowed to see another one order", 401);
    }
  }),
);
/**

 * @decs  change order status by id
 * @route /api/orders/:orderId
 * @method put
 * @access admin only
 */

router.route("/:orderId").put(
  verifyTokenForAdmin,
  asyncHandler(async (req, res) => {
    if (!isValidObjectId(req.params.orderId)) {
      throw new FailError("that is not a valid orderId", 400);
    }
    const myOrder = await Order.findById(req.params.orderId);
    if (!myOrder) {
      throw new FailError("didn't find that order", 404);
    }
    const { error } = validateEditOrderStatus(req.body);

    if (error) {
      throw new FailError(error.details[0].message, 400);
    }

    myOrder.status = req.body.status;
    const edited = await myOrder.save();

    return res.status(200).json({
      status: "success",
      data: { order: edited },
    });
  }),
);

module.exports = router;
