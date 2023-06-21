const mongoose = require("mongoose");

const priceSchema = mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["A", "B", "C", "D"],
      required: true,
      unique: true,
    },
    value: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Price", priceSchema);
