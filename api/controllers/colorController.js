const asyncHandler = require("express-async-handler");
const Color = require("../models/colorModel");
const { default: mongoose } = require("mongoose");

//@desc Read all colors
//@route GET /api/color
//@access private
const colorReadAll = asyncHandler(async (req, res) => {
  try {
    const color = await Color.find({});
    return res.status(200).json(color);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
});

//@desc Create new color
//@route POST /api/color
//@access private

const colorCreate = asyncHandler(async (req, res) => {
  const { color } = req.body;

  try {
    console.log("The request body is: ", req.body);

    const existingColor = await Color.findOne({ color });
    if (existingColor) {
      return res.status(409).send("Color already exists");
    }

    const colorValue = new Color({
      color,
    });
    await colorValue.save();
    return res.status(201).json(colorValue);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(err.message);
    } else {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  }
});

//@desc Read color by id
//@route GET /api/color/:id
//@access private

const colorReadId = asyncHandler(async (req, res) => {
  try {
    const color = await Color.findById(req.params.id);
    if (!color) {
      return res.status(404).send({ error: "Color not found" });
    }
    return res.status(200).json(color);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

//@desc Edit color
//@route PUT /api/color/:id
//@access private

const colorEdit = asyncHandler(async (req, res) => {
  try {
    const color = await Color.findById(req.params.id);
    if (!color) {
      return res.status(404).send("Color not found!");
    }

    color.set(req.body);
    const validationError = color.validateSync();
    if (validationError) {
      return res.status(400).send(validationError.message);
    }

    const updatedColor = await Color.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedColor);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
});

//@desc Delete color
//@route DELETE /api/color/:id
//@access private

const colorDelete = asyncHandler(async (req, res) => {
  try {
    const color = await Color.findById(req.params.id);
    if (!color) {
      return res.status(404).send("Color not found");
    }
    await color.deleteOne({ _id: req.params.id });
    return res.status(200).json({ success: true, data: color });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = {
  colorReadAll,
  colorCreate,
  colorReadId,
  colorEdit,
  colorDelete,
};
