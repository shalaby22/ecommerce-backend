const express = require("express");
const router = express.Router();
const {validate} = require("../middlewares/validateJoi");
const { validateRegister} = require("../validators/users-validator")
const {
  verifyTokenForAdmin,
  verifyTokenForAuthOrAdmin,
} = require("../middlewares/verifytoken");

const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../Controllers/users.controller");

router.route("/").get(verifyTokenForAdmin, getAllUsers);
router
  .route("/:id")
  .get(verifyTokenForAuthOrAdmin, getUser)
  .put(verifyTokenForAuthOrAdmin,validate(validateRegister,"put"), updateUser)
  .delete(verifyTokenForAuthOrAdmin, deleteUser);

module.exports = router;
