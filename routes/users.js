const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const asyncHandler = require("express-async-handler");

const { User, validateRegister } = require("../models/users-model");

const {
  verifyTokenForAdmin,
  verifyTokenForAuthOrAdmin,
} = require("../middlewares/verifytoken");

const { FailError } = require("../middlewares/errors");
const isValidObjectId = require("../utils/isValidObjectId");
/**
 * @decs  get all users
 * @route /api/users/
 * @method get
 * @access admin
 */

router.route("/").get(
  verifyTokenForAdmin,
  asyncHandler(async (req, res) => {
    const users = await User.find().select("-password");
    return res.status(200).json({
      status: "success",
      data: { users },
    });
  }),
);
/**

 * @decs  get user by id
 * @route /api/users/:id
 * @method get
* @access admin or auth 
 */

router.route("/:id").get(
  verifyTokenForAuthOrAdmin,
  asyncHandler(async (req, res) => {
    if (!isValidObjectId(req.params.id)) {
      throw new FailError("that is not a valid userId", 400);
    }

    const user = await User.findById(req.params.id).select("-password");
    if (user) {
      return res.status(200).json({
        status: "success",
        data: { user },
      });
    } else {
      throw new FailError("that user not found", 404);
    }
  }),
);

/**

 * @decs  update a user by id
 * @route /api/users/:id
 * @method put
* @access admin or auth 
 */

router.route("/:id").put(
  verifyTokenForAuthOrAdmin,
  asyncHandler(async (req, res) => {
    if (!isValidObjectId(req.params.id)) {
      throw new FailError("that is not a valid userId", 400);
    }
    const user = await User.findById(req.params.id);

    if (!user) {
      throw new FailError("that user not found", 404);
    }

    const validated = validateRegister(req.body, "put");

    if (validated.error) {
      throw new FailError(validated.error, 400);
    }

    let hash = undefined;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      hash = await bcrypt.hash(req.body.password, salt);
    } else {
      const hash = undefined;
    }
    let newUser;
    try {
      newUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          addresses: req.body.addresses,
          userName: req.body.userName,
          email: req.body.email,
          lastName: req.body.lastName,
          firstName: req.body.firstName,
          phone: req.body.phone,
          password: hash,
          payments: req.body.payments,
        },
        {
          new: true,
        },
      ).select("-password");
    } catch (error) {
      if (error.code === 11000) {
        console.log(error);
        const field = Object.keys(error.keyValue)[0];
        throw new FailError(`this ${field} already exists`, 400);
      }
      throw new FailError(error, 400);
    }

    return res.status(200).json({
      status: "success",
      data: { user: newUser },
    });
  }),
);

/**

 * @decs  delete a user by id
 * @route /api/users/:id
 * @method delete
* @access admin or auth 
 */
router.route("/:id").delete(
  verifyTokenForAuthOrAdmin,
  asyncHandler(async (req, res) => {
    if (!isValidObjectId(req.params.id)) {
      throw new FailError("that is not a valid userId", 400);
    }
    const user = await User.findById(req.params.id);

    if (!user) {
      throw new FailError("that user not found", 404);
    }

    const deleted = await User.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      status: "success",
      data: "deleted successfully",
    });
  }),
);

module.exports = router;
