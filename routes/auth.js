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

/**

 * @decs  login user
 * @route /api/auth/login
 * @method post
 */

router.route("/login").post(
  asyncHandler(async (req, res) => {
    const validated = validateLogin(req.body);
    if (validated.error) {
      return res.status(400).json(validated.error.details[0].message);
    }
    const myUser = await User.findOne({ email: req.body.email });

    if (!myUser) {
      return res.status(400).json("wrong email or password");
    }

    const checkPassword = await bcrypt.compare(
      req.body.password,
      myUser.password,
    );

    if (!checkPassword) {
      return res.status(400).json("wrong email or password");
    }

    const token = generateToken(myUser);
    const {password , ...other} = myUser._doc;
    return res.status(200).json({ ...other, token: token });
  }),
);

/**

 * @decs  register new user
 * @route /api/auth/register
 * @method post
 */

router.route("/register").post(
  asyncHandler(async (req, res) => {
    const validated = validateRegister(req.body,"post");
    if (validated.error) {
      return res.status(400).json(validated.error);
    }

    const userFound = await User.findOne({email: req.body.email})
    if(userFound){
      
       return res.status(400).json("this user already registered");
    }

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
    await myUser.save();

    const token = generateToken(myUser);

    const {password , ...other} = myUser._doc;
    res.json({ ...other, token: token });
  }),
);

const generateToken = function (myUser) {
  const token = jwt.sign(
    { _id: myUser._id, email: myUser.email, isAdmin: myUser.isAdmin },
    process.env.TOKEN_PASSWORD,{ expiresIn: '2d' }
  );
  return token;
};
module.exports = router;
