const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
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
    image: { type: String },
  },
  { timestamps: true },
);

const Category = mongoose.model("Category", categorySchema);

module.exports = { Category };
