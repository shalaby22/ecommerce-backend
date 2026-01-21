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

/**

 * @decs  add item to cart
 * @route /api/cart/add
 * @method post
 * @access auth  
 */

router.route("/add").post(
  verifyToken,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("cart");

    if (!user) {
      return res.status(400).json("didn't find your user");
    }

    const { error } = validateAddCart(req.body, "post");

    if (error) {
      return res.status(400).json(error.details[0].message);
    }
    //todo separate stock validation in a function below
    let max;
    const myProduct = await Product.findById(req.body.productId).select();
    if (!myProduct) {
      return res.status(404).json("didn't find that product");
    } else if (myProduct.stock < req.body.quantity) {
      return res.status(400).json("the stock is not enough");
    } else {
      max = myProduct.stock;
    }

    let done = false;

    for (let i = 0; i < user.cart.length; i++) {
      if (req.body.productId == user.cart[i].product) {
        user.cart[i].quantity += +req.body.quantity;
        if (user.cart[i].quantity > +max) {
          return res.status(400).json("the stock is not enough");
        }
        done = true;
      }
    }
    if (!done) {
      user.cart = [
        ...user.cart,
        { product: req.body.productId, quantity: req.body.quantity },
      ];
    }

    const saved = await user.save();
    console.log("added");

    res.status(200).json(saved.cart);
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

    if (!user) {
      return res.status(400).json("didn't find your user");
    }

    res.status(200).json({ cart: user.cart, totalPrice: user.cartPrice() });
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

    if (!user) {
      return res.status(400).json("didn't find your user");
    }
    user.cart = [];
    const deleted = await user.save();
    res.status(200).json(deleted);
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
    const user = await User.findById(req.user._id).select("cart");

    if (!user) {
      return res.status(400).json("didn't find your user");
    }

    user.cart = user.cart.filter((ele) => req.params.productId != ele.product);

    const deleted = await user.save();
    res.status(200).json(deleted);
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
    const user = await User.findById(req.user._id).select("cart");
    let done = false;
    if (!user) {
      return res.status(400).json("didn't find your user");
    }

    const { error } = validateAddCart(req.body, "put");

    if (error) {
      return res.status(400).json(error.details[0].message);
    }

    let max;
    const myProduct = await Product.findById(req.params.productId).select();
    if (!myProduct) {
      return res.status(404).json("didn't find that product");
    } else if (myProduct.stock < req.body.quantity) {
      return res.status(400).json("the stock is not enough");
    } else {
      max = myProduct.stock;
    }

    user.cart.forEach((ele, i) => {
      if (req.params.productId == ele.product) {
        user.cart[i].quantity = req.body.quantity;
        done = true;
      }
    });

    if (!done) {
      return res
        .status(400)
        .json("this product isn't in your cart please add it");
    }

    const edited = await user.save();
    res.status(200).json(edited.cart);
  }),
);

module.exports = router;
