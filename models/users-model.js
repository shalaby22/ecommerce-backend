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
          product: {
            type: Schema.Types.ObjectId,
            ref: "Product",
          },
          quantity: { type: Number, required: true, min: 0 },
        },
      ],
    },
  },
  { timestamps: true },
);

userSchema.methods.cartPrice = function () {
  const sum = this.cart.reduce(
    (accumulator, currentValue) =>
      accumulator + currentValue.product.price * currentValue.quantity,
    0,
  );
  return sum;
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
