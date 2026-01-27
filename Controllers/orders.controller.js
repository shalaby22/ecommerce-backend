const asyncHandler = require("express-async-handler");

const {
  makeOrderFunc,
  getOrdersByUserIdFunc,
  getAllOrdersFunc,
  getOrderByIdFunc,
  changeOrderStatusByIdFunc,
  cancelOrderByIdFunc
} = require("../services/orders.services");

/**

 * @decs  make an order
 * @route /api/orders
 * @method post
 * @access auth  
 */

const makeOrder = asyncHandler(async (req, res) => {
  const saved = await makeOrderFunc(req.user, req.body);

  return res.status(200).json({
    status: "success",
    data: { order: saved },
  });
});

/**

 * @decs  get user orders
 * @route /api/orders
 * @method get
 * @access auth  
 */

const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await getOrdersByUserIdFunc(req.user._id);
  return res.status(200).json({
    status: "success",
    data: { orders },
  });
});

/**

 * @decs  get orders by userId
 * @route /api/orders/user/:userId
 * @method get
 * @access admin only  
 */

const getOrdersByUserId = asyncHandler(async (req, res) => {
  const orders = await getOrdersByUserIdFunc(req.params.userId);

  return res.status(200).json({
    status: "success",
    data: { orders: orders },
  });
});

/**

 * @decs  get all orders
 * @route /api/orders/all
 * @method get
 * @access admin only  
 */

const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await getAllOrdersFunc();

  return res.status(200).json({
    status: "success",
    data: { orders },
  });
});

/**

 * @decs  get a single order
 * @route /api/orders/:orderId
 * @method get
 * @access auth or admin 
 */

const getOrderById = asyncHandler(async (req, res) => {
  const order = await getOrderByIdFunc(req.params.orderId, req.user);
  return res.status(200).json({
    status: "success",
    data: { order },
  });
});

/**

 * @decs  change order status by id
 * @route /api/orders/:orderId
 * @method put
 * @access admin only
 */
const changeOrderStatusById = asyncHandler(async (req, res) => {
  const order = await changeOrderStatusByIdFunc(req.params.orderId, req.body);
  return res.status(200).json({
    status: "success",
    data: { order },
  });
});


/**

 * @decs  cancel order by id
 * @route /api/orders/:orderId/cancel
 * @method post
 * @access auth or admin 
 */
const cancelOrderById = asyncHandler(async (req, res) => {
  const order = await cancelOrderByIdFunc(req.params.orderId,req.user);
  return res.status(200).json({
    status: "success",
    data: { order },
  });
});

module.exports = {
  makeOrder,
  getUserOrders,
  getOrdersByUserId,
  getAllOrders,
  getOrderById,
  changeOrderStatusById,
  cancelOrderById
};
