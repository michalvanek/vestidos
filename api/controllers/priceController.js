const asyncHandler = require("express-async-handler");
const Price = require("../models/priceModel");
const { default: mongoose } = require("mongoose");

//@desc Read all prices
//@route GET /api/price
//@access private
const priceReadAll = asyncHandler(async (req, res) => {
  try {
    const price = await Price.find({});
    res.status(200).json(price);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

//@desc Edit price
//@route PUT /api/price/:id
//@access private

const priceEdit = asyncHandler(async (req, res) => {
  try {
    const price = await Price.findById(req.params.id);
    if (!price) {
      res.status(404);
      return res.json({ message: "Dress not found!" });
    }

    price.set(req.body);
    const validationError = price.validateSync();
    if (validationError) {
      res.status(400).json({ message: validationError.message });
      return;
    }

    const updatedPrice = await Price.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedPrice);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = {
  priceReadAll,
  priceEdit,
};
