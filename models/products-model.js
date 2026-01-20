const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 40,
      trim: true,
    },
    description: {
      type: String,
      minLength: 8,
      maxLength: 500,
      trim: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    images: { type: [String] },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
  },
  { timestamps: true },
);

const Product = mongoose.model("Product", productSchema);

const Joi = require("joi");

const validateProduct = function (myObj, method) {
  const schema = Joi.object({
    name: Joi.string()
      .alphanum()
      .min(3)
      .max(40)
      .alter({
        put: (schema) => schema.optional(),
        post: (schema) => schema.required(),
      }),

    description: Joi.string().min(8).max(500),

    stock: Joi.number()
      .integer()
      .positive()
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
module.exports = { Product,validateProduct };
