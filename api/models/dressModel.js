const mongoose = require("mongoose");

const dressSchema = mongoose.Schema(
  {
    talla: {
      type: String,
      required: [true, "Please provide the dress size"],
    },
    color: {
      type: String,
      required: [true, "Please provide the dress color"],
    },
    piedras: {
      type: Boolean,
      required: [true, "Please provide the dress stones"],
    },
    precio: {
      type: Number,
      required: [true, "Please provide the dress price"],
    },
    fotoPrincipal: {
      type: String,
      required: [true, "Please provide the main dress photo"],
    },
    fotos: {
      type: Array,
      required: [true, "Please provide the dress photos"],
    },
    costo: {
      type: String,
      required: [true, "Please provide the dress cost"],
    },
    marca: {
      type: String,
      required: [true, "Please provide the dress brand"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Dress", dressSchema);
