const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please add the user name"],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: [true, "Email required"],
      validate: {
        validator: function (value) {
          // Regular expression for email validation
          const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
          return emailRegex.test(value);
        },
        message: "Email address is invalid",
      },
    },
    password: {
      type: String,
      required: [true, "Please add the user password"],
      // minlength: 4, = password is hashed so the validation of length is in the controller
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
