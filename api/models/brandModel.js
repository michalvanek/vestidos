const mongoose = require("mongoose");

const brandSchema = mongoose.Schema(
  {
    marca: {
      type: String,
      minLength: 2,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Brand", brandSchema);
