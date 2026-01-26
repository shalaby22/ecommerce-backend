const asyncHandler = require("express-async-handler");

const {
  getAllCategoriesFunc,
  getCategoryFunc,
  getProductsOfCategoryFunc,
  addCategoryFunc,
  editCategoryFunc,
  deleteCategoryFunc,
} = require("../services/categories.services");
/**
 * @decs  get all Categories
 * @route /api/category/
 * @method get
 * @access any
 */

const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await getAllCategoriesFunc();
  return res.status(200).json({
    status: "success",
    data: { categories },
  });
});

/**

 * @decs  get a Category by id
 * @route /api/category/:id
 * @method get
 * @access any
 */

const getCategory = asyncHandler(async (req, res) => {
  const category = await getCategoryFunc(req.params.id);
  return res.status(200).json({
    status: "success",
    data: { category },
  });
});

/**

 * @decs  get products of Category by id
 * @route /api/category/:id/products
 * @method get
 * @access any
 */

const getProductsOfCategory = asyncHandler(async (req, res) => {
  const data = await getProductsOfCategoryFunc(req.params.id, req.query);

  return res.status(200).json({
    status: "success",
    data: { products: data.products, pagination: data.pagination },
  });
});
/**

 * @decs  add a  Category
 * @route /api/category/
 * @method post
 * @access any
 */

const addCategory = asyncHandler(async (req, res) => {
  const category = await addCategoryFunc(req.body);

  return res.status(201).json({
    status: "success",
    data: { category: category },
  });
});

/**

 * @decs  edit a  Category
 * @route /api/category/:id
 * @method put
 * @access any
 */

const editCategory = asyncHandler(async (req, res) => {
  const category = await editCategoryFunc(req.params.id, req.body);

  return res.status(200).json({
    status: "success",
    data: { category },
  });
});
/**

 * @decs  delete a Category
 * @route /api/category/:id
 * @method delete
 * @access any
 */

const deleteCategory = asyncHandler(async (req, res) => {
  const category = await deleteCategoryFunc(req.params.id);

  return res.status(200).json({
    status: "success",
    data: category,
  });
});

module.exports = {
  getAllCategories,
  getCategory,
  getProductsOfCategory,
  addCategory,
  editCategory,
  deleteCategory,
};
