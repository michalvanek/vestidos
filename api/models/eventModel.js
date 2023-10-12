const mongoose = require("mongoose");

const eventSchema = mongoose.Schema(
  {
    NameOfEvent: {
      type: String,
      required: [true, "Please provide the name of event"],
      maxlength: [25, "Name of event cannot exceed 25 characters"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
