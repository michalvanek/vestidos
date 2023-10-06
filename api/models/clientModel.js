const mongoose = require("mongoose");

const clientSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please provide client`s first name"],
      maxlength: [25, "First name cannot exceed 25 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Please provide client`s last name"],
      maxlength: [25, "First name cannot exceed 25 characters"],
    },
    phoneNumber: {
      type: String,
      required: false,
      trim: true,
      maxlength: [13, "Phone number cannot exceed 13 characters"],
      validate: {
        validator: function (value) {
          // Regular expression to match numbers and the + character
          const phoneNumberRegex = /^[0-9+]+$/;
          return phoneNumberRegex.test(value);
        },
        message: "Phone number is invalid",
      },
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      validate: [
        {
          validator: function (value) {
            if (!value) {
              // Allow empty email (represented as null)
              return true;
            }
            // Regular expression for email validation
            const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
            return emailRegex.test(value);
          },
          message: "Email address is invalid",
        },
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Client", clientSchema);
