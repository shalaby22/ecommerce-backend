const { Product } = require("../models/products-model");
const { Category } = require("../models/categories-model");
const { FailError } = require("../middlewares/errors");
const isValidObjectId = require("../utils/isValidObjectId");
const {getAllProductsFunc} = require("./products.services");
/**
 * @decs  get all Categories
 * @route /api/category/
 * @method get
 * @access any
 */
const getAllCategoriesFunc = async function () {
  const categories = await Category.find().sort({ createdAt: 1 });
  return categories;
};

/**

 * @decs  get a Category by id
 * @route /api/category/:id
 * @method get
 * @access any
 */

const getCategoryFunc = async function (id) {
  if (!isValidObjectId(id)) {
    throw new FailError("that is not a valid categoryId", 400);
  }
  const category = await Category.findById(id);
  if (!category) {
    throw new FailError("didn't find that Category", 404);
  }

  return category;
};

/**

 * @decs  get products of Category by id
 * @route /api/category/:id/products
 * @method get
 * @access any
 */

const getProductsOfCategoryFunc = async function (id,reqQuery) {
  if (!isValidObjectId(id)) {
    throw new FailError("that is not a valid categoryId", 400);
  }
  const category = await Category.findById(id);
  if (!category) {
    throw new FailError("didn't find that Category", 404);
  }
  // const products = await Product.find({ category: category._id });
  reqQuery.category = id;
  const data = getAllProductsFunc(reqQuery)

  //can put get products func here
  return data;
};
/**

 * @decs  add a  Category
 * @route /api/category/
 * @method post
 * @access any
 */

const addCategoryFunc = async function (reqBody) {

  const newCategory = new Category({
    name: reqBody.name,
    description: reqBody.description,
    image: reqBody.image,
  });
  try {
    await newCategory.save();
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      throw new FailError(`this category ${field} already exists`, 400);
    }
    throw new FailError(error, 400);
  }
  return newCategory;
};

/**

 * @decs  edit a  Category
 * @route /api/category/:id
 * @method put
 * @access any
 */

const editCategoryFunc = async function (id, reqBody) {
  if (!isValidObjectId(id)) {
    throw new FailError("that is not a valid categoryId", 400);
  }
  const myCategory = await Category.findById(id);
  if (!myCategory) {
    throw new FailError("didn't find that Category", 404);
  }
  let newCategory;
  try {
    newCategory = await Category.findByIdAndUpdate(
      id,
      {
        name: reqBody.name,
        description: reqBody.description,
        image: reqBody.image,
      },
      {
        new: true,
      },
    );
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      throw new FailError(`this category ${field} already exists`, 400);
    }
  }

  return newCategory;
};

/**

 * @decs  delete a Category
 * @route /api/category/:id
 * @method delete
 * @access any
 */
const deleteCategoryFunc = async function (id) {
  if (!isValidObjectId(id)) {
    throw new FailError("that is not a valid categoryId", 400);
  }
  const myCategory = await Category.findById(id);
  if (!myCategory) {
    throw new FailError("didn't find that Category", 404);
  }
  const newCategory = await Category.findByIdAndDelete(id);

  return "deleted successfully";
};

module.exports = {
  getAllCategoriesFunc,
  getCategoryFunc,
  getProductsOfCategoryFunc,
  addCategoryFunc,
  editCategoryFunc,
  deleteCategoryFunc,
};
