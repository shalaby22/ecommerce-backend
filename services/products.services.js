const { Product } = require("../models/products-model");
const { Category } = require("../models/categories-model");
const { FailError } = require("../middlewares/errors");
const isValidObjectId = require("../utils/isValidObjectId");
const { DEFAULT_PAGE_LIMIT,DEFAULT_SORTING_METHOD } = require("../config/constants");
const { log } = require("winston");




/**

 * @decs  get all Products
 * @route /api/products/
 * @method get
 * @access any
 */

const getAllProductsFunc = async function (reqQuery) {
  const page = reqQuery.page || 1;
  const countAPage = reqQuery.countAPage || DEFAULT_PAGE_LIMIT;
  const sort = reqQuery.sort || DEFAULT_SORTING_METHOD;

  const sortObj = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    "price-asc": { price: 1 },
    "price-desc": { price: -1 },
  };
  let query = {};
  if (reqQuery.search && reqQuery.search.trim() !== "") {
    query.$text = { $search: reqQuery.search };
  }
  if (reqQuery.category) {
      if (!isValidObjectId(reqQuery.category)) {
    throw new FailError("that is not a valid category Id in searching", 400);
  }
    query.category = reqQuery.category;
  }
  if (reqQuery.maxPrice || reqQuery.minPrice) {
    query.price = {};
    if (reqQuery.minPrice) query.price.$gte = +reqQuery.minPrice;
    if (reqQuery.maxPrice) query.price.$lte = +reqQuery.maxPrice;
  }



  const products = await Product.find(query)
    .sort({ ...sortObj[`${sort}`] })
    .skip((page - 1) * countAPage)
    .limit(countAPage)
    .populate("category", "name")

  const total = await Product.countDocuments(query);
  const pages = Math.ceil(total / countAPage);

  const pagination = {
    page:page,
    limit:countAPage,
    total:total,
    pages:pages,
    hasNext: page < pages,
    hasPrev: page > 1
  }

  return {products,pagination};
};

/**

 * @decs  get a Product by id
 * @route /api/products/:id
 * @method get
 * @access any
 */

const getProductFunc = async function (id) {
  if (!isValidObjectId(id)) {
    throw new FailError("that is not a valid productId", 400);
  }
  const myProduct = await Product.findById(id).populate("category", [
    "name",
    "image",
    "description",
  ]);
  if (!myProduct) {
    throw new FailError("didn't find that product", 404);
  }

  return myProduct;
};

/**

 * @decs  add a product
 * @route /api/products/
 * @method post
 * @access admin only
 */

const addProductFunc = async function (reqBody) {
  if (reqBody.category) {
    const myCategory = await Category.findOne({ name: reqBody.category });
    if (!myCategory) {
      throw new FailError("didn't find that category", 404);
    }
    reqBody.categoryId = myCategory._id;
  }

  const newProduct = new Product({
    name: reqBody.name,
    description: reqBody.description,
    stock: reqBody.stock,
    price: reqBody.price,
    images: reqBody.images,
    category: reqBody.categoryId,
  });

  await newProduct.save();

  return newProduct;
};

/**

 * @decs  edit by id
 * @route /api/products/:id
 * @method put
 * @access admin only
 */

const editProductFunc = async function (id, reqBody) {
  if (!isValidObjectId(id)) {
    throw new FailError("that is not a valid productId", 400);
  }
  const myProduct = await Product.findById(id);
  if (!myProduct) {
    throw new FailError("didn't find that product", 404);
  }

  if (reqBody.category) {
    const myCategory = await Category.findOne({ name: reqBody.category });
    if (!myCategory) {
      throw new FailError("didn't find that category", 404);
    }
    reqBody.categoryId = myCategory._id;
  }
  const newProduct = await Product.findByIdAndUpdate(
    id,
    {
      name: reqBody.name,
      description: reqBody.description,
      stock: reqBody.stock,
      price: reqBody.price,
      images: reqBody.images,
      category: reqBody.categoryId,
    },
    {
      new: true,
    },
  );

  return newProduct;
};

/**

 * @decs  delete by id
 * @route /api/products/:id
 * @method delete
 * @access admin only
 */

const deleteProductFunc = async function (id) {
  if (!isValidObjectId(id)) {
    throw new FailError("that is not a valid productId", 400);
  }
  const myProduct = await Product.findById(id);
  if (!myProduct) {
    throw new FailError("didn't find that product", 404);
  }

  const deletedProduct = await Product.findByIdAndDelete(id);

  return "deleted successfully";
};

module.exports = {
  getAllProductsFunc,
  getProductFunc,
  addProductFunc,
  editProductFunc,
  deleteProductFunc,
};
