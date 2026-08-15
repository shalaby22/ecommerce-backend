
const Joi = require("joi");

const validateCategory = function (myObj, method) {
  const schema = Joi.object({
    name: Joi.string()
      .min(3)
      .max(40)
      .alter({
        put: (schema) => schema.optional(),
        post: (schema) => schema.required(),
      }),

    description: Joi.string()
      .min(8)
      .max(500)
      .alter({
        put: (schema) => schema.optional(),
        post: (schema) => schema.required(),
      }),

    image: Joi.string().max(500),
  });

  const postSchema = schema.tailor("post");
  const putSchema = schema.tailor("put");
  if (method === "put") {
    return putSchema.validate(myObj);
  } else {
    return postSchema.validate(myObj);
  }
};
module.exports = {validateCategory}