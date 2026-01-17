const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
    minLength: 6,
    maxLength: 20,
    trim: true,
    unique: true,
  },
  password: { type: String, required: true, minLength: 8, maxLength: 100 },
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
    trim: true
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
        expiry: { type: String, required: true,minLength: 4,maxLength: 9,required: true},
        cvv: { type: String, required: true,minLength: 3,maxLength: 4,required: true},
      },
    ],
  },
  addresses: { type: [String] },
  cart: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "product",
      },
    ],
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
