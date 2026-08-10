const Joi = require("joi");

const validateProduct = function (myObj, method) {
  const schema = Joi.object({
    name: Joi.string()
      .min(3)
      .max(200)
      .alter({
        put: (schema) => schema.optional(),
        post: (schema) => schema.required(),
      }),

    description: Joi.string().min(8).max(500),

    stock: Joi.number()
      .integer()
      .min(0)
      .alter({
        put: (schema) => schema.optional(),
        post: (schema) => schema.required(),
      }),

    price: Joi.number()
      .positive()
      .alter({
        put: (schema) => schema.optional(),
        post: (schema) => schema.required(),
      }),

    category: Joi.string().max(40),

    images: Joi.array().items(Joi.string()),
  });

  const postSchema = schema.tailor("post");
  const putSchema = schema.tailor("put");
  if (method === "put") {
    return putSchema.validate(myObj);
  } else {
    return postSchema.validate(myObj);
  }
};

module.exports = { validateProduct };
