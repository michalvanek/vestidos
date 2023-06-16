const mongoose = require("mongoose");

const dressSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: [true, "Please provide the shopping list name"],
    },
    owner: {
      type: Array,
      required: [true, "Please provide the shopping list owner(s)"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Dress", dressSchema);
