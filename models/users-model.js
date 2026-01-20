const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      minLength: 6,
      maxLength: 20,
      trim: true,
      unique: true,
    },
    password: { type: String, required: true, minLength: 1, maxLength: 100 },
    email: {
      type: String,
      required: true,
      minLength: 8,
      maxLength: 50,
      trim: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 20,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 20,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      minLength: 8,
      maxLength: 20,
      trim: true,
    },
    payments: {
      type: [
        {
          cardNumber: {
            type: String,
            required: true,
            minLength: 16,
            maxLength: 16,
            trim: true,
          },
          expiry: { type: String, required: true, minLength: 4, maxLength: 9 },
          cvv: { type: String, required: true, minLength: 3, maxLength: 4 },
        },
      ],
    },
    addresses: { type: [String] },
    isAdmin: { type: Boolean, default: false },
    cart: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Product",
        },
      ],
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

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
      .regex(/^[0-9]{10}$/)
      .messages({ "string.pattern.base": `Phone number must have 10 digits.` }),

    payments: Joi.array().items(
      Joi.object({
        cardNumber: Joi.string().required().min(16).max(16),
        expiry: Joi.string().required().min(4).max(9),
        cvv: Joi.string().required().min(3).max(4),
      }),
    ),
    addresses: Joi.array().items(Joi.string()),

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
      ["userName", "firstName", "lastName", "password", "phone","email"],
      makeRequired,
    );
  }
  return schema.validate(myObj);
};

// const validateUpdate = function (myObj) {
//   const schema = Joi.object({
//     userName: Joi.string().alphanum().min(6).max(20),

//     firstName: Joi.string().alphanum().min(1).max(20),

//     lastName: Joi.string().alphanum().min(1).max(20),

//     password: passwordComplexity(complexityOptions),

//     phone: Joi.string()
//       .regex(/^[0-9]{10}$/)
//       .messages({ "string.pattern.base": `Phone number must have 10 digits.` }),
//     payments: Joi.array().items(
//       Joi.object({
//         cardNumber: Joi.string().required().min(16).max(16),
//         expiry: Joi.string().required().min(4).max(9),
//         cvv: Joi.string().required().min(3).max(4),
//       }),
//     ),
//     addresses: Joi.array().items(Joi.string()),

//     email: Joi.string()
//       .email({
//         minDomainSegments: 2,
//         tlds: { allow: ["com", "net"] },
//       })
//       .optional(),
//   });
//   return schema.validate(myObj);
// };

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



module.exports = { User, validateLogin, validateRegister };
