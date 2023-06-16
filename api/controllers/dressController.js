const asyncHandler = require("express-async-handler");
const Dress = require("../models/dressModel");
const adminIds = JSON.parse(process.env.ADMIN);

//@desc Read all shopping lists
//@route GET /api/dress
//@access private
const dressReadAll = asyncHandler(async (req, res) => {
  try {
    if (adminIds.includes(req.user.id)) {
      const dresss = await Dress.find({});
      res.status(200).json(dresss);
    } else {
      const dresss = await Dress.find({
        $or: [{ user_id: req.user.id }, { owner: { $in: [req.user.id] } }],
      });
      res.status(200).json(dresss);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

//@desc Create new shopping list
//@route POST /api/dress
//@access private

const dressCreate = asyncHandler(async (req, res) => {
  try {
    console.log("The request body is: ", req.body);
    const { name, owner } = req.body;
    if (!name || !owner) {
      res.status(400);
      return res.json({
        message: "Please provide values for both the 'name' and 'owner' fields",
      });
    }
    const dress = await Dress.create({
      name,
      owner,
      user_id: req.user.id,
    });
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

//@desc Read shopping list by id
//@route GET /api/dress/:id
//@access private

const dressReadId = asyncHandler(async (req, res) => {
  try {
    const dress = await Dress.findById(req.params.id);
    if (!dress) {
      return res.status(404).json({ error: "Shopping list not found" });
    }
    if (
      dress.user_id.toString() !== req.user.id &&
      !adminIds.includes(req.user.id) &&
      !dress.owner.includes(req.user.id)
    ) {
      return res.status(403).json({
        error: "User don't have permission to read other user's shopping list",
      });
    }
    res.status(200).json(dress);
  } catch (error) {
    res.status(500).json({ error: "Failed to read shopping list" });
  }
});

//@desc Edit shopping list
//@route PUT /api/dress/:id
//@access private

const dressEdit = asyncHandler(async (req, res) => {
  try {
    const dress = await Dress.findById(req.params.id);
    if (!dress) {
      res.status(404);
      return res.json({ message: "Shopping list not found!" });
    }

    if (
      dress.user_id.toString() !== req.user.id &&
      !adminIds.includes(req.user.id) &&
      !dress.owner.includes(req.user.id)
    ) {
      res.status(403);
      return res.json({
        message:
          "User doesn't have permission to edit other user's shopping list",
      });
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

//@desc Delete shopping list
//@route DELETE /api/dress/:id
//@access private

const dressDelete = asyncHandler(async (req, res) => {
  try {
    const dress = await Dress.findById(req.params.id);
    if (!dress) {
      return res.status(404).json({ error: "Shopping list not found" });
    }
    if (
      dress.user_id.toString() !== req.user.id &&
      !adminIds.includes(req.user.id) &&
      !dress.owner.includes(req.user.id)
    ) {
      return res.status(403).json({
        error:
          "User don't have permission to delete other user's shopping list",
      });
    }
    await dress.deleteOne({ _id: req.params.id });
    res.status(200).json({ success: true, data: dress });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete shopping list" });
  }
});

module.exports = {
  dressReadAll,
  dressCreate,
  dressReadId,
  dressEdit,
  dressDelete,
};
