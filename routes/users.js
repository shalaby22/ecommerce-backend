const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const asyncHandler = require("express-async-handler");

const { User, validateUpdate } = require("../models/users-model");
const {
  verifyToken,
  verifyTokenForAdmin,
  verifyTokenForAuthOrAdmin,
} = require("../middlewares/verifyToken");
/**

 * @decs  get all users
 * @route /api/users/
 * @method get
 * 
 */

router.route("/").get(
  verifyTokenForAdmin,asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.status(200).json(users);
  }),
);
/**

 * @decs  get user bt id
 * @route /api/users/:id
 * @method get
 * 
 */

router.route("/:id").get(
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  }),
);

/**

 * @decs  update a user by id
 * @route /api/users/:id
 * @method put
 * 
 */

router.route("/:id").put(
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(400).json("didn't find that user");
    }
    const validated = validateUpdate(req.body);
    if (validated.error) {
      return res.status(400).json(validated.error);
    }

    let hash = undefined;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      hash = await bcrypt.hash(req.body.password, salt);
    } else {
      const hash = undefined;
    }

    const newUser = await User.findByIdAndUpdate(
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
    );
    console.log("edited");

    res.status(200).json(newUser);
  }),
);

/**

 * @decs  delete a user by id
 * @route /api/users/:id
 * @method delete
 * 
 */
router.route("/:id").delete(
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(400).json("didn't find that user");
    }

    const deleted = await User.findByIdAndDelete(req.params.id);
    console.log(deleted);

    res.status(200).json("deleted successfully");
  }),
);

module.exports = router;
