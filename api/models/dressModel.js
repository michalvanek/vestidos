const mongoose = require("mongoose");

const dressSchema = mongoose.Schema(
  {
    talla: {
      type: [String],
      required: [true, "Please provide the dress size"],
      enum: {
        values: ["CH", "M", "G", "XG", "Adolescente"],
        message:
          "{VALUE} is not supported, please insert one of those: XCH, CH, M, G, XG, XXG (case sensitive)",
      },
      nullable: false,
    },
    color: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Color",
      required: [true, "Please provide the dress brand"],
    },
    piedras: {
      type: Boolean,
      required: [true, "Please provide the dress stones"],
    },
    precio: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Price",
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
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: [true, "Please provide the dress brand"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Dress", dressSchema);
