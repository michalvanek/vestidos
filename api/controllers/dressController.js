const asyncHandler = require("express-async-handler");
const Dress = require("../models/dressModel");
const adminIds = JSON.parse(process.env.ADMIN);
const { default: mongoose } = require("mongoose");

//@desc Read all dresss
//@route GET /api/dress
//@access private
const dressReadAll = asyncHandler(async (req, res) => {
  try {
    const dress = await Dress.find({});
    res.status(200).json(dress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

//@desc Create new dress
//@route POST /api/dress
//@access private

const dressCreate = asyncHandler(async (req, res) => {
  const { talla, color, piedras, precio, fotoPrincipal, fotos, costo, marca } =
    req.body;

  try {
    console.log("The request body is: ", req.body);

    // if (!name || !owner) {
    //   res.status(400);
    //   return res.json({
    //     message: "Please provide values for both the 'name' and 'owner' fields",
    //   });
    // }
    const dress = new Dress({
      talla,
      color,
      piedras,
      precio,
      fotoPrincipal,
      fotos,
      costo,
      marca,
    });
    await dress.save();
    res.status(201).json(dress);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ message: err.message });
    } else {
      console.error(err);
      res.status(500).json({ message: "Server Error" });
    }
  }
});

//@desc Read dress by id
//@route GET /api/dress/:id
//@access private

const dressReadId = asyncHandler(async (req, res) => {
  try {
    const dress = await Dress.findById(req.params.id);
    if (!dress) {
      return res.status(404).json({ error: "Dress not found" });
    }
    res.status(200).json(dress);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

//@desc Edit dress
//@route PUT /api/dress/:id
//@access private

const dressEdit = asyncHandler(async (req, res) => {
  try {
    const dress = await Dress.findById(req.params.id);
    if (!dress) {
      res.status(404);
      return res.json({ message: "Dress not found!" });
    }

    dress.set(req.body);
    const validationError = dress.validateSync();
    if (validationError) {
      res.status(400).json({ message: validationError.message });
      return;
    }

    const updatedDress = await Dress.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedDress);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

//@desc Delete dress
//@route DELETE /api/dress/:id
//@access private

const dressDelete = asyncHandler(async (req, res) => {
  try {
    const dress = await Dress.findById(req.params.id);
    if (!dress) {
      return res.status(404).json({ error: "Dress not found" });
    }
    await dress.deleteOne({ _id: req.params.id });
    res.status(200).json({ success: true, data: dress });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete dress" });
  }
});

module.exports = {
  dressReadAll,
  dressCreate,
  dressReadId,
  dressEdit,
  dressDelete,
};
