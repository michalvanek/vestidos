const asyncHandler = require("express-async-handler");
const Rent = require("../models/rentModel");
const adminIds = JSON.parse(process.env.ADMIN);
const { default: mongoose } = require("mongoose");

//@desc Read all rents
//@route GET /api/rent
//@access private
const rentReadAll = asyncHandler(async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const formattedStartDate = new Date(startDate);
    const formattedEndDate = new Date(endDate);

    if (
      isNaN(formattedStartDate.getTime()) ||
      isNaN(formattedEndDate.getTime())
    ) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    // Find rents within the provided date range
    const rents = await Rent.find({
      dateOfBooking: {
        $gte: formattedStartDate,
        $lte: formattedEndDate,
      },
    });

    const rentsWithinRange = rents.map((rent) => {
      return {
        _id: rent._id,
        dateOfBooking: rent.dateOfBooking,
        bookingAmount: rent.bookingAmount,
        remainingAmount: rent.remainingAmount,
        pickUpDate: rent.pickUpDate,
        dressId: rent.dressId,
        createdAt: rent.createdAt,
        updatedAt: rent.updatedAt,
        __v: rent.__v,
      };
    });

    return res.status(200).json(rentsWithinRange);
  } catch (error) {
    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: err.message });
    } else {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  }
});

//@desc Create new rent
//@route POST /api/rent
//@access private

const rentCreate = asyncHandler(async (req, res) => {
  const { dateOfBooking, bookingAmount, remainingAmount, pickUpDate, dressId } =
    req.body;

  try {
    const rent = new Rent({
      dateOfBooking,
      bookingAmount,
      remainingAmount,
      pickUpDate,
      dressId,
    });
    await rent.save();
    return res.status(201).json(rent);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(err.message);
    } else {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  }
});

//@desc Edit rent
//@route PUT /api/rent/:id
//@access private

const rentEdit = asyncHandler(async (req, res) => {
  try {
    const rent = await Rent.findById(req.params.id);
    if (!rent) {
      return res.status(404).send("Rent not found!");
    }

    const {
      dateOfBooking,
      amountBooking,
      remainingAmount,
      pickUpDate,
      dressId,
    } = req.body;

    // Update the rent object properties
    rent.dateOfBooking = dateOfBooking;
    rent.amountBooking = amountBooking;
    rent.remainingAmount = remainingAmount;
    rent.pickUpDate = pickUpDate;
    rent.dressId = dressId;

    const validationError = rent.validateSync();
    if (validationError) {
      return res.status(400).send(validationError.message);
    }

    const updatedRent = await rent.save();

    return res.status(200).json(updatedRent);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
});

//@desc Delete rent
//@route DELETE /api/rent/:id
//@access private

const rentDelete = asyncHandler(async (req, res) => {
  try {
    const rent = await Rent.findById(req.params.id);
    if (!rent) {
      return res.status(404).send("Rent not found");
    }
    await rent.deleteOne({ _id: req.params.id });
    return res
      .status(200)
      .json({ success: true, message: "Rent deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
});

module.exports = {
  rentReadAll,
  rentCreate,
  rentEdit,
  rentDelete,
};
