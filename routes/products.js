const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { Product, validateProduct } = require("../models/products-model");
const { Category } = require("../models/categories-model");

const { verifyTokenForAdmin } = require("../middlewares/verifytoken");
const { FailError } = require("../middlewares/errors");

/**

 * @decs  get all Products
 * @route /api/products/
 * @method get
 * @access any
 */

router.route("/").get(
  asyncHandler(async (req, res) => {
    const page = req.query.page || 1;
    const countAPage = req.query.countAPage || 5;
    const products = await Product.find()
      .skip((page - 1) * countAPage)
      .limit(countAPage)
      .populate("category", "name");

    return res.status(200).json({
      status: "success",
      data: { products },
    });
  }),
);
/**

 * @decs  get a Product by id
 * @route /api/products/:id
 * @method get
 * @access any
 */

router.route("/:id").get(
  asyncHandler(async (req, res) => {
    const myProduct = await Product.findById(req.params.id).populate(
      "category",
      ["name", "image", "description"],
    );
    if (!myProduct) {
      throw new FailError("didn't find that product", 404);
    }

    return res.status(200).json({
      status: "success",
      data: { product: myProduct },
    });
  }),
);

/**

 * @decs  add a product
 * @route /api/products/
 * @method post
 * @access admin only
 */

router.route("/").post(
  verifyTokenForAdmin,
  asyncHandler(async (req, res) => {
    const { error } = validateProduct(req.body, "post");

    if (error) {
      throw new FailError(error.details[0].message, 400);
    }

    if (req.body.category) {
      const myCategory = await Category.findOne({ name: req.body.category });
      if (!myCategory) {
        throw new FailError("didn't find that category", 404);
      }
      req.body.categoryId = myCategory._id;
    }

    const newProduct = new Product({
      name: req.body.name,
      description: req.body.description,
      stock: req.body.stock,
      price: req.body.price,
      images: req.body.images,
      category: req.body.categoryId,
    });

    await newProduct.save();
    return res.status(201).json({
      status: "success",
      data: { product: newProduct },
    });
  }),
);

/**

 * @decs  edit by id
 * @route /api/products/:id
 * @method put
 * @access admin only
 */

router.route("/:id").put(
  verifyTokenForAdmin,
  asyncHandler(async (req, res) => {
    const myProduct = await Product.findById(req.params.id);
    if (!myProduct) {
      throw new FailError("didn't find that product", 404);
    }
    const { error } = validateProduct(req.body, "put");

    if (error) {
      throw new FailError(error.details[0].message, 400);
    }

    if (req.body.category) {
      const myCategory = await Category.findOne({ name: req.body.category });
      if (!myCategory) {
        throw new FailError("didn't find that category", 404);
      }
      req.body.categoryId = myCategory._id;
    }
    const newProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
        stock: req.body.stock,
        price: req.body.price,
        images: req.body.images,
        category: req.body.categoryId,
      },
      {
        new: true,
      },
    );

    return res.status(200).json({
      status: "success",
      data: { product: newProduct },
    });
  }),
);

/**

 * @decs  delete by id
 * @route /api/products/:id
 * @method delete
 * @access admin only
 */

router.route("/:id").delete(
  verifyTokenForAdmin,
  asyncHandler(async (req, res) => {
    const myProduct = await Product.findById(req.params.id);
    if (!myProduct) {
      throw new FailError("didn't find that product", 404);

    }

    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      status: "success",
      data: "deleted successfully",
    });
  }),
);

module.exports = router;
