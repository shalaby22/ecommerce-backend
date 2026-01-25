const express = require("express");
const router = express.Router();
const {validate} = require("../middlewares/validateJoi");
const { validateRegister} = require("../validators/users-validator")
const {
  verifyTokenForAdmin,
  verifyTokenForAuthOrAdmin,
  verifyAdmin,
  verifyToken,
  verifyAuthOrAdmin
} = require("../middlewares/verifytoken");

const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../Controllers/users.controller");

router.route("/").get(verifyToken,verifyAdmin, getAllUsers);
router
  .route("/:id")
  .get(verifyToken,verifyAuthOrAdmin, getUser)
  .put(verifyToken,verifyAuthOrAdmin,validate(validateRegister,"put"), updateUser)
  .delete(verifyToken,verifyAuthOrAdmin,deleteUser);

module.exports = router;
