const Joi = require("joi");

const validateNewOrder = function (myObj) {
  const schema = Joi.object({
    addressIndex: Joi.number().integer().min(0).required(),

    paymentIndex: Joi.number().integer().min(0).required(),

  });

  return schema.validate(myObj);
};
const validateEditOrderStatus = function (myObj) {
  const schema = Joi.object({
    status: Joi.string().required().valid("pending", "paid", "shipped", "delivered", "cancelled"),


  });

  return schema.validate(myObj);
};

module.exports = {validateNewOrder,validateEditOrderStatus}