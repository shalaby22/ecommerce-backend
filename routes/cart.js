const express = require("express");
const router = express.Router();

const asyncHandler = require("express-async-handler");

const { User, validateAddCart } = require("../models/users-model");
const { Product } = require("../models/products-model");

const {
  verifyTokenForAdmin,
  verifyTokenForAuthOrAdmin,
  verifyToken,
} = require("../middlewares/verifytoken");

const { FailError } = require("../middlewares/errors");

/**

 * @decs  add item to cart
 * @route /api/cart/add
 * @method post
 * @access auth  
 */

router.route("/add").post(
  verifyToken,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
      .select("cart")
      .populate({ path: "cart.product", select: "name price stock" });

    const { error } = validateAddCart(req.body, "post");

    if (error) {
      throw new FailError(error.details[0].message, 400);
    }

    let max;
    const myProduct = await Product.findById(req.body.productId).select(
      "name price stock",
    );
    if (!myProduct) {
      throw new FailError("didn't find that product", 404);
    } else if (myProduct.stock < req.body.quantity) {
      throw new FailError("the stock is not enough", 400);
    } else {
      max = myProduct.stock;
    }

    let done = false;

    for (let i = 0; i < user.cart.length; i++) {
      if (req.body.productId == user.cart[i].product._id) {
        user.cart[i].quantity += +req.body.quantity;
        if (user.cart[i].quantity > +max) {
          throw new FailError("the stock is not enough", 400);
        }
        done = true;
      }
    }
    if (!done) {
      user.cart = [
        ...user.cart,
        { product: myProduct, quantity: req.body.quantity },
      ];
    }
    const saved = await user.save();

    const cart = { cart: [...saved.cart], totalPrice: user.cartPrice() };

    return res.status(200).json({
      status: "success",
      data: cart,
    });
  }),
);

/**

 * @decs  get cart of user
 * @route /api/cart/
 * @method get
 * @access auth  
 */

router.route("/").get(
  verifyToken,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
      .select("cart")
      .populate({ path: "cart.product", select: "name price stock" });

    const cart = { cart: [...user.cart], totalPrice: user.cartPrice() };

    return res.status(200).json({
      status: "success",
      data: cart,
    });
  }),
);

/**

 * @decs  DELETE THE WHOLE cart of user
 * @route /api/cart/
 * @method DELETE
 * @access auth  
 */

router.route("/").delete(
  verifyToken,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("cart");
    user.cart = [];
    const deleted = await user.save();

    return res.status(200).json({
      status: "success",
      data: "the cart is empty successfully",
    });
  }),
);

/**

 * @decs  DELETE a product from cart of user
 * @route /api/cart/:productId
 * @method DELETE
 * @access auth  
 */

router.route("/:productId").delete(
  verifyToken,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
      .select("cart")
      .populate({ path: "cart.product", select: "name price stock" });


    user.cart = user.cart.filter((ele) => req.params.productId != ele.product._id);

    const deleted = await user.save();

    const cart = { cart: [...user.cart], totalPrice: user.cartPrice() };

    return res.status(200).json({
      status: "success",
      data: cart,
    });
  }),
);
/**

 * @decs  edit quantity of a product from cart of user
 * @route /api/cart/:productId
 * @method put
 * @access auth  
 */

router.route("/:productId").put(
  verifyToken,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
      .select("cart")
      .populate({ path: "cart.product", select: "name price stock" });

    let done = false;

    const { error } = validateAddCart(req.body, "put");

    if (error) {
      throw new FailError(error.details[0].message, 400);
    }

  
    const myProduct = await Product.findById(req.params.productId).select();
    if (!myProduct) {
      throw new FailError("didn't find that product", 404);
    } else if (myProduct.stock < req.body.quantity) {
      throw new FailError("the stock is not enough", 400);
    }
    user.cart.forEach((ele, i) => {
      if (req.params.productId == ele.product._id) {
        user.cart[i].quantity = req.body.quantity;
        done = true;
      }
    });

    if (!done) {
      throw new FailError("this product isn't in your cart please add it", 400);
    }

    const edited = await user.save();

    const cart = { cart: [...user.cart], totalPrice: edited.cartPrice() };


    return res.status(200).json({
      status: "success",
      data: cart,
    });
  }),
);

module.exports = router;
