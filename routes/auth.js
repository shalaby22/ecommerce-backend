const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const asyncHandler = require("express-async-handler");

const {
  User,
  validateLogin,
  validateRegister,
} = require("../models/users-model");

const { FailError } = require("../middlewares/errors");

/**

 * @decs  login user
 * @route /api/auth/login
 * @method post
 */

router.route("/login").post(
  asyncHandler(async (req, res) => {
    const validated = validateLogin(req.body);
    if (validated.error) {
      throw new FailError(validated.error.details[0].message, 400);
    }
    const myUser = await User.findOne({ email: req.body.email });

    if (!myUser) {
      throw new FailError("wrong email or password", 400);
    }

    const checkPassword = await bcrypt.compare(
      req.body.password,
      myUser.password,
    );

    if (!checkPassword) {
      throw new FailError("wrong email or password", 400);
    }

    const token = generateToken(myUser);
    const { password, ...other } = myUser._doc;
    const user = { ...other, token: token };
    return res.status(200).json({
      status: "success",
      data: { user },
    });
  }),
);

/**

 * @decs  register new user
 * @route /api/auth/register
 * @method post
 */

router.route("/register").post(
  asyncHandler(async (req, res) => {
    const validated = validateRegister(req.body, "post");
    if (validated.error) {
      throw new FailError(validated.error.details[0].message, 400);
    }

    // const userFound = await User.findOne({ email: req.body.email });
    // if (userFound) {
    //   throw new FailError("this email already registered", 400);
    // }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);

    const myUser = new User({
      addresses: req.body.addresses,
      userName: req.body.userName,
      email: req.body.email,
      lastName: req.body.lastName,
      firstName: req.body.firstName,
      phone: req.body.phone,
      password: hash,
      payments: req.body.payments,
    });

    try {
      await myUser.save();
    } catch (error) {
      if (error.code === 11000) {
        console.log(error);
        const field = Object.keys(error.keyValue)[0];
        throw new FailError(`this ${field} already exists`, 400);
      }
      throw new FailError(error, 400);
    }

    const token = generateToken(myUser);

    const { password, ...other } = myUser._doc;
    const user = { ...other, token: token };
    return res.status(201).json({
      status: "success",
      data: { user },
    });
  }),
);

const generateToken = function (myUser) {
  const token = jwt.sign(
    { _id: myUser._id, email: myUser.email, isAdmin: myUser.isAdmin },
    process.env.TOKEN_PASSWORD,
    { expiresIn: "7d" },
  );
  return token;
};

module.exports = router;
