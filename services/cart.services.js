const { User } = require("../models/users-model");
const { Product } = require("../models/products-model");

const { FailError } = require("../middlewares/errors");
const { verifyCartProducts } = require("../utils/verifyCartProducts");
const isValidObjectId = require("../utils/isValidObjectId");

/**
 * @decs  merge items to cart
 * @route /api/cart/merge
 * @method post
 * @access auth
 */
const mergeItemsToCartFunc = async function (reqBody, reqUser) {
  const user = await User.findById(reqUser._id)
    .select("cart")
    .populate({ path: "cart.product", select: "name price stock images" });

  const { edited, myCart } = verifyCartProducts(user.cart);
  if (edited) {
    user.cart = myCart;
  }

  for (let product of reqBody) {
    if (!isValidObjectId(product.productId)) {
      continue;
    }
    let max;
    const myProduct = await Product.findById(product.productId).select(
      "name price stock images",
    );

    if (!myProduct || myProduct.stock === 0) {
      continue;
    } else {
      max = myProduct.stock;
    }

    let done = false;
    for (let i = 0; i < user.cart.length; i++) {
      if (product.productId == user.cart[i].product._id) {
        done = true;
      }
    }
    if (done) continue;

    let quantity =
      myProduct.stock < product.quantity ? myProduct.stock : product.quantity;
    user.cart = [...user.cart, { product: myProduct, quantity: quantity }];
  }

  const saved = await user.save();

  const cart = { cart: [...saved.cart], total: user.cartPrice() };

  return cart;
};

/**
 * @decs  add item to cart
 * @route /api/cart/add
 * @method post
 * @access auth
 */
const addItemToCartFunc = async function (reqBody, reqUser) {
  if (!isValidObjectId(reqBody.productId)) {
    throw new FailError("that is not a valid productId", 400);
  }
  const user = await User.findById(reqUser._id)
    .select("cart")
    .populate({ path: "cart.product", select: "name price stock images" });

  let max;
  const myProduct = await Product.findById(reqBody.productId).select(
    "name price stock images",
  );

  if (!myProduct) {
    throw new FailError("didn't find that product", 404);
  } else if (myProduct.stock < reqBody.quantity) {
    throw new FailError("the stock is not enough", 400);
  } else {
    max = myProduct.stock;
  }

  const { edited, myCart } = verifyCartProducts(user.cart);
  if (edited) {
    user.cart = myCart;
  }

  let done = false;

  for (let i = 0; i < user.cart.length; i++) {
    if (reqBody.productId == user.cart[i].product._id) {
      user.cart[i].quantity += +reqBody.quantity;
      if (user.cart[i].quantity > +max) {
        throw new FailError("the stock is not enough", 400);
      }
      done = true;
    }
  }
  if (!done) {
    user.cart = [
      ...user.cart,
      { product: myProduct, quantity: reqBody.quantity },
    ];
  }
  const saved = await user.save();

  const cart = { cart: [...saved.cart], total: user.cartPrice() };

  return cart;
};

/**
 * @decs  get cart of user
 * @route /api/cart/
 * @method get
 * @access auth
 */

const getCartFunc = async function (reqUser) {
  const user = await User.findById(reqUser._id)
    .select("cart")
    .populate({ path: "cart.product", select: "name price stock images" });

  const { edited, myCart } = verifyCartProducts(user.cart);

  if (edited) {
    user.cart = myCart;
    await user.save();
  }
  const cart = { cart: [...user.cart], total: user.cartPrice() };

  return cart;
};

/**
 * @decs  DELETE THE WHOLE cart of user
 * @route /api/cart/
 * @method DELETE
 * @access auth
 */

const deleteCartFunc = async function (reqUser) {
  const user = await User.findById(reqUser._id).select("cart");
  user.cart = [];
  const deleted = await user.save();

  return "the cart is empty successfully";
};

/**
 * @decs  DELETE a product from cart of user
 * @route /api/cart/:productId
 * @method DELETE
 * @access auth
 */

const deleteProductFromCartFunc = async function (productId, reqUser) {
  const user = await User.findById(reqUser._id)
    .select("cart")
    .populate({ path: "cart.product", select: "name price stock images" });

  const { edited, myCart } = verifyCartProducts(user.cart);
  if (edited) {
    user.cart = myCart;
  }

  user.cart = user.cart.filter((ele) => productId != ele.product._id);

  const deleted = await user.save();
  const cart = { cart: [...user.cart], total: user.cartPrice() };
  return cart;
};

/**
 * @decs  edit quantity of a product from cart of user
 * @route /api/cart/:productId
 * @method put
 * @access auth
 */

const editProductFromCartFunc = async function (productId, reqUser, reqBody) {
  if (!isValidObjectId(productId)) {
    throw new FailError("that is not a valid productId", 400);
  }

  const user = await User.findById(reqUser._id)
    .select("cart")
    .populate({ path: "cart.product", select: "name price stock images" });

  let done = false;

  const myProduct = await Product.findById(productId).select();

  if (!myProduct) {
    throw new FailError("didn't find that product", 404);
  } else if (myProduct.stock < reqBody.quantity) {
    throw new FailError("the stock is not enough", 400);
  }

  const { edited, myCart } = verifyCartProducts(user.cart);
  if (edited) {
    user.cart = myCart;
  }

  user.cart.forEach((ele, i) => {
    if (productId == ele.product._id) {
      user.cart[i].quantity = reqBody.quantity;
      done = true;
    }
  });

  if (!done) {
    throw new FailError("this product isn't in your cart please add it", 400);
  }

  const edited2 = await user.save();

  const cart = { cart: [...user.cart], total: edited2.cartPrice() };

  return cart;
};

module.exports = {
  addItemToCartFunc,
  getCartFunc,
  deleteCartFunc,
  deleteProductFromCartFunc,
  editProductFromCartFunc,
  mergeItemsToCartFunc,
};
