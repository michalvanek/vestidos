const asyncHandler = require("express-async-handler");
const Brand = require("../models/brandModel");
const adminIds = JSON.parse(process.env.ADMIN);
const { default: mongoose } = require("mongoose");

//@desc Read all brands
//@route GET /api/brand
//@access private
const brandReadAll = asyncHandler(async (req, res) => {
  try {
    const brand = await Brand.find({});
    res.status(200).json(brand);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

//@desc Create new brand
//@route POST /api/brand
//@access private

const brandCreate = asyncHandler(async (req, res) => {
  const { marca } = req.body;

  try {
    console.log("The request body is: ", req.body);

    const brand = new Brand({
      marca,
    });
    await brand.save();
    res.status(201).json(brand);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ message: err.message });
    } else {
      console.error(err);
      res.status(500).json({ message: "Server Error" });
    }
  }
});

//@desc Read brand by id
//@route GET /api/brand/:id
//@access private

const brandReadId = asyncHandler(async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ error: "Brand not found" });
    }
    res.status(200).json(brand);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

//@desc Edit brand
//@route PUT /api/brand/:id
//@access private

const brandEdit = asyncHandler(async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      res.status(404);
      return res.json({ message: "Brand not found!" });
    }

    brand.set(req.body);
    const validationError = brand.validateSync();
    if (validationError) {
      res.status(400).json({ message: validationError.message });
      return;
    }

    const updatedBrand = await Brand.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedBrand);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

//@desc Delete brand
//@route DELETE /api/brand/:id
//@access private

const brandDelete = asyncHandler(async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ error: "Brand not found" });
    }
    await brand.deleteOne({ _id: req.params.id });
    res.status(200).json({ success: true, data: brand });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete brand" });
  }
});

module.exports = {
  brandReadAll,
  brandCreate,
  brandReadId,
  brandEdit,
  brandDelete,
};
