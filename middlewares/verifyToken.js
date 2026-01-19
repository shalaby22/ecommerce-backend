const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers.token;
  if (!token) {
    res.status(400).json("no token provided");
  }
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_PASSWORD);
    req.user = decoded;
  } catch (err) {
    res.status(400).json("something wrong with token ==>>" + err);
  }

  next();
};
const verifyTokenForAdmin = function (req, res, next) {
  verifyToken(req, res, () => {
    if (!req.user.isAdmin) {
      res.status(400).json("you are not admin");
    } else {
      next();
    }
  });
};

const verifyTokenForAuthOrAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (!req.user.isAdmin && req.params.id !== req.user._id) {
      res.status(400).json("you are not allowed to make that for another user");
    } else {
      next();
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenForAdmin,
  verifyTokenForAuthOrAdmin,
};
