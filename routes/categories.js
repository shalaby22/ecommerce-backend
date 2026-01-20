const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { Product } = require("../models/products-model");
const { Category, validateCategory } = require("../models/categories-model");
const { verifyTokenForAdmin } = require("../middlewares/verifytoken");

/**

 * @decs  get all Categories
 * @route /api/category/
 * @method get
 * @access any
 */

router.route("/").get(
  asyncHandler(async (req, res) => {
    const categories = await Category.find().select();
    res.status(200).json(categories);
  }),
);

/**

 * @decs  get a Category by id
 * @route /api/category/:id
 * @method get
 * @access any
 */

router.route("/:id").get(
  asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) {
      res.status(404).json("didn't find that Category");
    }

    res.status(200).json(category);
  }),
);

/**

 * @decs  get products of Category by id
 * @route /api/category/:id/products
 * @method get
 * @access any
 */

router.route("/:id/products").get(
  asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) {
      res.status(404).json("didn't find that Category");
    }
    const products = await Product.find({ category: category._id });

    res.status(200).json(products);
  }),
);

/**

 * @decs  add a  Category
 * @route /api/category/
 * @method post
 * @access any
 */

router.route("/").post(
  verifyTokenForAdmin,
  asyncHandler(async (req, res) => {
    const { error } = validateCategory(req.body, "post");

    if (error) {
      res.status(400).json(error.details[0].message);
    }

    const newCategory = new Category({
      name: req.body.name,
      description: req.body.description,
      image: req.body.image,
    });
    await newCategory.save();
    res.status(200).json(newCategory);
  }),
);
/**

 * @decs  edit a  Category
 * @route /api/category/:id
 * @method put
 * @access any
 */

router.route("/:id").put(
  verifyTokenForAdmin,
  asyncHandler(async (req, res) => {
    const myCategory = await Category.findById(req.params.id);
    if (!myCategory) {
      res.status(404).json("didn't find that Category");
    }
    const { error } = validateCategory(req.body, "put");

    if (error) {
      res.status(400).json(error.details[0].message);
    }

    const newCategory = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
        image: req.body.image,
      },
      {
        new: true,
      },
    );
    res.status(200).json(newCategory);
  }),
);
/**

 * @decs  delete a Category
 * @route /api/category/:id
 * @method delete
 * @access any
 */

router.route("/:id").delete(
  verifyTokenForAdmin,
  asyncHandler(async (req, res) => {
    const myCategory = await Category.findById(req.params.id);
    if (!myCategory) {
      res.status(404).json("didn't find that Category");
    }
    const newCategory = await Category.findByIdAndDelete(req.params.id);
    res.status(200).json("deleted successfully");
  }),
);

module.exports = router;
