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
      maxlength: [5, "First name cannot exceed 5 characters"],
      trim: true,
      validate: {
        validator: function (value) {
          // Regular expression to match numbers
          const bookingAmountRegex = /^[0-9]+$/;
          return bookingAmountRegex.test(value);
        },
        message: "Invalid format of booking amount. Use only numbers",
      },
    },
    remainingAmount: {
      type: String,
      required: [true, "Please provide the remaining amount"],
      maxlength: [5, "First name cannot exceed 5 characters"],
      trim: true,
      validate: {
        validator: function (value) {
          // Regular expression to match numbers
          const remainingAmountRegex = /^[0-9]+$/;
          return remainingAmountRegex.test(value);
        },
        message: "Invalid format of remaining amount. Use only numbers",
      },
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
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: [true, "Please provide the client"],
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Please provide the type of event"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Rent", rentSchema);
