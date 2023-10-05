const mongoose = require("mongoose");

const rentSchema = mongoose.Schema(
  {
    dateOfBooking: {
      type: Date,
      required: [true, "Please provide the date of booking"],
    },
    bookingAmount: {
      type: String,
      required: [true, "Please provide the amount of booking"],
    },
    remainingAmount: {
      type: String,
      required: [true, "Please provide the remaining amount"],
    },
    pickUpDate: {
      type: Date,
      required: [true, "Please provide the pick-up date"],
    },
    dressId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dress",
      required: [true, "Please provide the dress"],
    },
    // typeOfEvent: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Event",
    //     required: [true, "Please provide the type of event"],
    //   },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Rent", rentSchema);
