const asyncHandler = require("express-async-handler");
const Brand = require("../models/brandModel");
const { default: mongoose } = require("mongoose");

//@desc Read all brands
//@route GET /api/brand
//@access private
const brandReadAll = asyncHandler(async (req, res) => {
  try {
    const brand = await Brand.find({});
    return res.status(200).json(brand);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
});

//@desc Create new brand
//@route POST /api/brand
//@access private

const brandCreate = asyncHandler(async (req, res) => {
  const { marca } = req.body;

  try {
    console.log("The request body is: ", req.body);

    const existingBrand = await Brand.findOne({ marca });
    if (existingBrand) {
      return res.status(409).send("Brand already exists");
    }

    const brand = new Brand({
      marca,
    });
    await brand.save();
    return res.status(201).json(brand);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(err.message);
    } else {
      console.error(err);
      return res.status(500).json({ message: err.message });
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
      return res.status(404).send({ error: "Brand not found" });
    }
    return res.status(200).json(brand);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

//@desc Edit brand
//@route PUT /api/brand/:id
//@access private

const brandEdit = asyncHandler(async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).send("Brand not found!");
    }

    brand.set(req.body);
    const validationError = brand.validateSync();
    if (validationError) {
      return res.status(400).send(validationError.message);
    }

    const updatedBrand = await Brand.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedBrand);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
});

//@desc Delete brand
//@route DELETE /api/brand/:id
//@access private

const brandDelete = asyncHandler(async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).send("Brand not found");
    }
    await brand.deleteOne({ _id: req.params.id });
    return res.status(200).json({ success: true, data: brand });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = {
  brandReadAll,
  brandCreate,
  brandReadId,
  brandEdit,
  brandDelete,
};
