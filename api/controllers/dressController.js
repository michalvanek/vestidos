const asyncHandler = require("express-async-handler");
const Dress = require("../models/dressModel");
const adminIds = JSON.parse(process.env.ADMIN);
const { default: mongoose } = require("mongoose");

//@desc Read all dresss
//@route GET /api/dress
//@access private
const dressReadAll = asyncHandler(async (req, res) => {
  try {
    const dresses = await Dress.find({}).populate("marca").populate("precio");

    const dressesWithBrandAndPrice = dresses.map((dress) => {
      return {
        _id: dress._id,
        talla: dress.talla,
        color: dress.color,
        piedras: dress.piedras,
        precio: dress.precio ? dress.precio.value : null,
        fotoPrincipal: dress.fotoPrincipal,
        fotos: dress.fotos,
        costo: dress.costo,
        marca: dress.marca ? dress.marca.marca : null,
        createdAt: dress.createdAt,
        updatedAt: dress.updatedAt,
        __v: dress.__v,
      };
    });

    return res.status(200).json(dressesWithBrandAndPrice);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server Error");
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
    return res.status(201).json(dress);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(err.message);
    } else {
      console.error(err);
      return res.status(500).send("Server Error");
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
      return res.status(404).send("Dress not found");
    }
    return res.status(200).json(dress);
  } catch (error) {
    return res.status(500).send("Server error");
  }
});

//@desc Edit dress
//@route PUT /api/dress/:id
//@access private

const dressEdit = asyncHandler(async (req, res) => {
  try {
    const dress = await Dress.findById(req.params.id);
    if (!dress) {
      return res.status(404).send("Dress not found!");
    }

    dress.set(req.body);
    const validationError = dress.validateSync();
    if (validationError) {
      return res.status(400).send(validationError.message);
    }

    const updatedDress = await Dress.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    return res.status(200).json(updatedDress);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
});

//@desc Delete dress
//@route DELETE /api/dress/:id
//@access private

const dressDelete = asyncHandler(async (req, res) => {
  try {
    const dress = await Dress.findById(req.params.id);
    if (!dress) {
      return res.status(404).send("Dress not found");
    }
    await dress.deleteOne({ _id: req.params.id });
    return res.status(200).json({ success: true, data: dress });
  } catch (error) {
    return res.status(500).send("Failed to delete dress");
  }
});

module.exports = {
  dressReadAll,
  dressCreate,
  dressReadId,
  dressEdit,
  dressDelete,
};
