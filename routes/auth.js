const express = require("express");
const router = express.Router();
const { loginUser, registerUser } = require("../Controllers/auth.controller");
const {validate} = require("../middlewares/validateJoi");
const { validateLogin, validateRegister} = require("../validators/users-validator")


router.route("/login").post(validate(validateLogin),loginUser);
router.route("/register").post(validate(validateRegister,"post"),registerUser);

module.exports = router;
