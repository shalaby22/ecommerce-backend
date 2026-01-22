const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { Product } = require("../models/products-model");
const { Category, validateCategory } = require("../models/categories-model");
const { verifyTokenForAdmin } = require("../middlewares/verifytoken");

const { FailError } = require("../middlewares/errors");

/**
 * @decs  get all Categories
 * @route /api/category/
 * @method get
 * @access any
 */

router.route("/").get(
  asyncHandler(async (req, res) => {
    const categories = await Category.find().select();

    return res.status(200).json({
      status: "success",
      data: { categories },
    });
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
      throw new FailError("didn't find that Category", 404);
    }

    return res.status(200).json({
      status: "success",
      data: { category },
    });
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
      throw new FailError("didn't find that Category", 404);
    }
    const products = await Product.find({ category: category._id });

    return res.status(200).json({
      status: "success",
      data: { products },
    });
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
      throw new FailError(error.details[0].message, 400);
    }

    const newCategory = new Category({
      name: req.body.name,
      description: req.body.description,
      image: req.body.image,
    });
    await newCategory.save();

    return res.status(201).json({
      status: "success",
      data: { category: newCategory },
    });
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
      throw new FailError("didn't find that Category", 404);
    }
    const { error } = validateCategory(req.body, "put");

    if (error) {
      throw new FailError(error.details[0].message, 400);
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

    return res.status(200).json({
      status: "success",
      data: { category: newCategory },
    });
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
      throw new FailError("didn't find that Category", 404);
    }
    const newCategory = await Category.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      status: "success",
      data: "deleted successfully",
    });
  }),
);

module.exports = router;
