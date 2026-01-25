const Joi = require("joi");

const validateAddCart = function (myObj, method) {
  const schema = Joi.object({
    productId: Joi.string()
      .max(25)
      .alter({
        put: (schema) => schema.forbidden(),
        post: (schema) => schema.required(),
      }),
    quantity: Joi.number().integer().positive().required(),
  });
  const postSchema = schema.tailor("post");
  const putSchema = schema.tailor("put");
  if (method === "put") {
    return putSchema.validate(myObj);
  } else {
    return postSchema.validate(myObj);
  }
};

module.exports = {validateAddCart}