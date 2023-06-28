const mongoose = require("mongoose");

const colorSchema = mongoose.Schema(
  {
    color: {
      type: String,
      minLength: 2,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Color", colorSchema);
