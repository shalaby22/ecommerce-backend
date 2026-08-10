const asyncHandler = require("express-async-handler");

const {
  addItemToCartFunc,
  getCartFunc,
  deleteCartFunc,
  deleteProductFromCartFunc,
  editProductFromCartFunc,
  mergeItemsToCartFunc,
} = require("../services/cart.services");

/**
 * @decs  merge item to cart
 * @route /api/cart/merge
 * @method post
 * @access auth
 */
const mergeItemsToCart = asyncHandler(async (req, res) => {
  const cart = await mergeItemsToCartFunc(req.body, req.user);
  
  return res.status(200).json({
    status: "success",
    data: cart,
  });
});

/**
 * @decs  add item to cart
 * @route /api/cart/add
 * @method post
 * @access auth
 */
const addItemToCart = asyncHandler(async (req, res) => {
  const cart = await addItemToCartFunc(req.body, req.user);

  return res.status(200).json({
    status: "success",
    data: cart,
  });
});

/**

 * @decs  get cart of user
 * @route /api/cart/
 * @method get
 * @access auth  
 */

const getCart = asyncHandler(async (req, res) => {
  const cart = await getCartFunc(req.user);

  return res.status(200).json({
    status: "success",
    data: cart,
  });
});

/**

 * @decs  DELETE THE WHOLE cart of user
 * @route /api/cart/
 * @method DELETE
 * @access auth  
 */

const deleteCart = asyncHandler(async (req, res) => {
  const cart = await deleteCartFunc(req.user);

  return res.status(200).json({
    status: "success",
    data: cart,
  });
});

/**

 * @decs  DELETE a product from cart of user
 * @route /api/cart/:productId
 * @method DELETE
 * @access auth  
 */
const deleteProductFromCart = asyncHandler(async (req, res) => {
  const cart = await deleteProductFromCartFunc(req.params.productId, req.user);

  return res.status(200).json({
    status: "success",
    data: cart,
  });
});

/**
 * @decs  edit quantity of a product from cart of user
 * @route /api/cart/:productId
 * @method put
 * @access auth
 */

const editProductFromCart = asyncHandler(async (req, res) => {
  const cart = await editProductFromCartFunc(
    req.params.productId,
    req.user,
    req.body,
  );

  return res.status(200).json({
    status: "success",
    data: cart,
  });
});

module.exports = {
  addItemToCart,
  getCart,
  deleteCart,
  deleteProductFromCart,
  editProductFromCart,
  mergeItemsToCart,
};
