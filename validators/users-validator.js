const Joi = require("joi");

const passwordComplexity = require("joi-password-complexity");

const complexityOptions = {
  min: 8,
  max: 20,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 2,
};

const validateRegister = function (myObj, method) {
  let schema = Joi.object({
    userName: Joi.string().alphanum().min(6).max(20),

    firstName: Joi.string().alphanum().min(1).max(20),

    lastName: Joi.string().alphanum().min(1).max(20),

    password: passwordComplexity(complexityOptions),

    phone: Joi.string()
      .regex(/^[0-9]{11}$/)
      .messages({ "string.pattern.base": `Phone number must have 11 digits.` }),

    payments: Joi.array().items(
      Joi.object({
        cardNumber: Joi.string().required().min(16).max(16),
        expiry: Joi.string().required().min(4).max(9),
        cvv: Joi.string().required().min(3).max(4),
      }),
    ),
    addresses: Joi.array().items(Joi.string().min(8)),

    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      })
      .optional(),
  });

  if (method === "post") {
    const makeRequired = (x) => x.required();

    schema = schema.fork(
      ["userName", "firstName", "lastName", "password", "phone", "email"],
      makeRequired,
    );
  }
  return schema.validate(myObj);
};

const validateLogin = function (myObj) {
  const schema = Joi.object({
    password: Joi.string().min(8).max(20).required(),

    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      })
      .message("invalid email"),
  });
  return schema.validate(myObj);
};

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


module.exports = { validateLogin, validateRegister, validateAddCart };
