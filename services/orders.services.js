const { User } = require("../models/users-model");
// const { Product } = require("../models/products-model");
const { Order } = require("../models/orders-model");

const { FailError } = require("../middlewares/errors");
const { verifyCartProducts } = require("../utils/verifyCartProducts");
const isValidObjectId = require("../utils/isValidObjectId");

/**

 * @decs  make an order
 * @route /api/orders
 * @method post
 * @access auth  
 */

const makeOrderFunc = async function (reqUser, reqBody) {
  const user = await User.findById(reqUser._id).select("+cart").populate({
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

  const addressIndex = reqBody.addressIndex;

  if (!user.addresses[+addressIndex]) {
    throw new FailError("this address index is empty", 400);
  }
  const paymentIndex = reqBody.paymentIndex;
  if (!user.payments[+paymentIndex]) {
    throw new FailError("this payment index is empty", 400);
  }

  let items = [];
  for (let i = 0; i < user.cart.length; i++) {
    // if (!myProduct) {
    //   throw new FailError(
    //     `didn't find that product index ${user.cart[i].product}`,
    //     404,
    //   );
    // };
    const myProduct = user.cart[i].product;
    if (myProduct.stock < user.cart[i].quantity) {
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
    user: reqUser._id,
    items: items,
    shippingAddress: user.addresses[+addressIndex],
    total: total,
    //status: reqBody.status,
  });

  const saved = await newOrder.save();

  user.cart = [];
  await user.save();

  return saved;
};

/**
 * @decs  get orders
 * @route /api/orders
 * @method get
 * @access auth
 */
/**

 * @decs  get orders by userId
 * @route /api/orders/user/:userId
 * @method get
 * @access admin only  
 */

// const getOrdersFunc = async function(reqUser){

//     const myOrders = await Order.find({ user: reqUser._id });

//     return res.status(200).json({
//       status: "success",
//       data: { orders: myOrders },
//     });
//   }

const getOrdersByUserIdFunc = async function (userId) {
  if (!isValidObjectId(userId)) {
    throw new FailError("that is not a valid userId", 400);
  }

  const orders = await Order.find({ user: userId });
  return orders;
};

/**

 * @decs  get all orders
 * @route /api/orders/all
 * @method get
 * @access admin only  
 */
const getAllOrdersFunc = async function () {
  const orders = await Order.find();
  return orders;
};

/**

 * @decs  get a single order
 * @route /api/orders/:orderId
 * @method get
 * @access auth or admin 
 */
const getOrderByIdFunc = async function (orderId, reqUser) {
  if (!isValidObjectId(orderId)) {
    throw new FailError("that is not a valid orderId", 400);
  }
  const myOrder = await Order.findById(orderId);
  if (!myOrder) {
    throw new FailError("didn't find that order", 404);
  }
  if (myOrder.user == reqUser._id || reqUser.isAdmin) {    
    return myOrder;
  } else {
    throw new FailError("not allowed to show another one order", 401);
  }
};
/**

 * @decs  change order status by id
 * @route /api/orders/:orderId
 * @method put
 * @access admin only
 */
const changeOrderStatusByIdFunc = async function (orderId, reqBody) {
  if (!isValidObjectId(orderId)) {
    throw new FailError("that is not a valid orderId", 400);
  }
  const myOrder = await Order.findById(orderId);
  if (!myOrder) {
    throw new FailError("didn't find that order", 404);
  }

  const allowedStatus = {
    pending: ["cancelled", "paid"],
    paid: ["shipped", "cancelled"],
    shipped: ["delivered"],
    delivered: [],
    cancelled: [],
  };

  if (allowedStatus[myOrder.status].includes(reqBody.status)) {
    myOrder.status = reqBody.status;
    await myOrder.save();
  } else {
    throw new FailError(
      `can't change ${myOrder.status} to ${reqBody.status} `,
      400,
    );
  }

  return myOrder;
};

/**

 * @decs  cancel order by id
 * @route /api/orders/:orderId/cancel
 * @method post
 * @access auth or admin 
 */

const cancelOrderByIdFunc = async function (orderId, reqUser) {
  const myOrder = await getOrderByIdFunc(orderId, reqUser);
  const allowedStatus = reqUser.isAdmin ? ["paid", "pending"] : ["pending"];
  
  if (allowedStatus.includes(myOrder.status)) {
    myOrder.status = "cancelled";
    await myOrder.save();
  } else {
    throw new FailError(
      `can't cancel order which status is ${myOrder.status}`,
      400,
    );
  }
  return myOrder;
};

module.exports = {
  makeOrderFunc,
  getOrdersByUserIdFunc,
  getAllOrdersFunc,
  getOrderByIdFunc,
  changeOrderStatusByIdFunc,
  cancelOrderByIdFunc
};
