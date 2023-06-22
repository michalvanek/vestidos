const asyncHandler = require("express-async-handler");
const Price = require("../models/priceModel");
const { default: mongoose } = require("mongoose");

//@desc Read all prices
//@route GET /api/price
//@access private
const priceReadAll = asyncHandler(async (req, res) => {
  try {
    const price = await Price.find({});
    return res.status(200).json(price);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server Error");
  }
});

//@desc Edit price
//@route PUT /api/price/:id
//@access private

const priceEdit = asyncHandler(async (req, res) => {
  try {
    const price = await Price.findById(req.params.id);
    if (!price) {
      return res.status(404).send("Dress not found!");
    }

    price.set(req.body);
    const validationError = price.validateSync();
    if (validationError) {
      return res.status(400).send(validationError.message);
    }

    const updatedPrice = await Price.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedPrice);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
});

module.exports = {
  priceReadAll,
  priceEdit,
};
