const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { Product } = require("../models/products-model");
const { Category } = require("../models/categories-model");

const { verifyTokenForAdmin } = require("../middlewares/verifytoken");

/**

 * @decs  get all Products
 * @route /api/products/
 * @method get
 * @access any
 */

router.route("/").get(
  asyncHandler(async (req, res) => {
    const page =  req.query.page || 1;
    const countAPage = req.query.countAPage || 5;
    const products = await Product.find().skip((page-1)*countAPage).limit(countAPage);
    res.status(200).json(products);
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
    const myProduct = await Product.findById(req.params.id).populate('category',['name','image',"description"]);
    if (!myProduct) {
      res.status(404).json("didn't find that product");
    }
    res.status(200).json(myProduct);
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
    if (req.body.category) {
      const myCategory = await Category.findOne({ name: req.body.category });
      if (!myCategory) {
        res.status(404).json("didn't find that category");
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
    res.status(200).json(newProduct);
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
      res.status(404).json("didn't find that product");
    }

    if (req.body.category) {
      const myCategory = await Category.findOne({ name: req.body.category });
      if (!myCategory) {
        res.status(404).json("didn't find that category");
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
    res.status(200).json(newProduct);
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
      res.status(404).json("didn't find that product");
    }

    const newProduct = await Product.findByIdAndDelete(req.params.id);
    res.status(200).json("deleted successfully");
  }),
);

module.exports = router;
