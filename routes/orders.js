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
  verifyTokenForAuthOrAdmin,
  verifyToken,
} = require("../middlewares/verifytoken");

const {FailError,serverError} = require("../middlewares/errors")
/**

 * @decs  make an order
 * @route /api/orders
 * @method post
 * @access auth  
 */

router.route("/").post(
  verifyToken,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select();

    if (!user) {
      return res.status(400).json("didn't find your user");
    } else if (!user.cart[0]) {
      return res.status(400).json("your cart is empty");
    }
    const { error } = validateNewOrder(req.body);

    if (error) {
      return res.status(400).json(error.details[0].message);
    }

    const addressIndex = req.body.addressIndex;

    if (!user.addresses[+addressIndex]) {
      return res.status(400).json("this address index is empty");
    }
    const paymentIndex = req.body.paymentIndex;
    if (!user.payments[+paymentIndex]) {
      return res.status(400).json("this payment index is empty");
    }



    //todo separate stock validation in a function below
    let total = 0;
    let items = [];
    for (let i = 0; i < user.cart.length; i++) {
      const myProduct = await Product.findById(user.cart[i].product).select();
      if (!myProduct) {
        return res
          .status(404)
          .json(`didn't find that product ${user.cart[i].product}`);
      } else if (myProduct.stock < user.cart[i].quantity) {
        return res
          .status(400)
          .json(
            `the stock is not enough for that product ${user.cart[i].product}`,
          );
      } else {
        items[i] = {
          product: user.cart[i].product,
          quantity: user.cart[i].quantity,
          price: myProduct.price,
        };
        total += myProduct.price * user.cart[i].quantity;
      }
    }
    //todo add payment verification
    const newOrder = new Order({
      user: req.user._id,
      items: items,
      shippingAddress: user.addresses[+addressIndex],
      total: total,
      //status: req.body.status,
    });

    const saved = await newOrder.save();

    res.status(200).json(saved);
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

    res.status(200).json(myOrders);
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
    const orders = await Order.find({ user: req.params.userId });
    res.status(200).json(orders);
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
    const myOrder = await Order.findById(req.params.orderId);

    if (myOrder.user == req.user._id || req.user.isAdmin) {
      return res.status(200).json(myOrder);
    } else {
      return res.status(401).json("not allowed to see another one order");
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
    const myOrder = await Order.findById(req.params.orderId);

    const { error } = validateEditOrderStatus(req.body);

    if (error) {
      return res.status(400).json(error.details[0].message);
    }

    myOrder.status = req.body.status;
    const edited = await myOrder.save();
    return res.status(200).json(edited);
  }),
);

module.exports = router;
