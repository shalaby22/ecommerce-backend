const { FailError } = require("./errors");

const validate = (validateFunc, method) => (req, res, next) => {
  const { error, value } = validateFunc(req.body, method);
  if (error) {
    throw new FailError(error.details[0].message, 400);
  }

  next();
};

module.exports = { validate };
