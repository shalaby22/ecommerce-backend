const asyncHandler = require("express-async-handler");

const {
  getAllProductsFunc,
  getProductFunc,
  addProductFunc,
  editProductFunc,
  deleteProductFunc,
} = require("../services/products.services");

/**
 * @decs  get all Products
 * @route /api/products/
 * @method get
 * @access any
 */

const getAllProducts = asyncHandler(async (req, res) => {
  const data = await getAllProductsFunc(req.query);

  return res.status(200).json({
    status: "success",
    data: { products: data.products, pagination: data.pagination },
  });
});
/**

 * @decs  get a Product by id
 * @route /api/products/:id
 * @method get
 * @access any
 */

const getProduct = asyncHandler(async (req, res) => {
  const product = await getProductFunc(req.params.id);

  return res.status(200).json({
    status: "success",
    data: { product },
  });
});

/**

 * @decs  add a product
 * @route /api/products/
 * @method post
 * @access admin only
 */
const addProduct = asyncHandler(async (req, res) => {
  const product = await addProductFunc(req.body);

  return res.status(201).json({
    status: "success",
    data: { product },
  });
});

/**
 * @decs  edit by id
 * @route /api/products/:id
 * @method put
 * @access admin only
 */

const editProduct = asyncHandler(async (req, res) => {
  const product = await editProductFunc(req.params.id, req.body);

  return res.status(200).json({
    status: "success",
    data: { product },
  });
});

/**

 * @decs  delete by id
 * @route /api/products/:id
 * @method delete
 * @access admin only
 */

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await deleteProductFunc(req.params.id);

  return res.status(200).json({
    status: "success",
    data: product,
  });
});

module.exports = {
  getAllProducts,
  getProduct,
  addProduct,
  editProduct,
  deleteProduct,
};
