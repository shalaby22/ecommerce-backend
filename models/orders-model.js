const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true, min: 0, required: true },
        price: {
          type: Number,
          required: true,
          min: 0,
          required: true,
        },
      },
    ],
    shippingAddress: {
      type: String,
      minLength: 8,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
      default: "pending",
      required: true,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    methods: {},
    timestamps: true,
  },
);

const Order = mongoose.model("Order", orderSchema);

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

module.exports = { Order, validateNewOrder,validateEditOrderStatus };
