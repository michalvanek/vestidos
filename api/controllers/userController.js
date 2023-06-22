const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { default: mongoose } = require("mongoose");
let refreshTokens = [];

function generateAccessToken(user) {
  return jwt.sign(
    {
      user: {
        username: user.username,
        email: user.email,
        id: user.id,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
}

//@desc Create a user
//@route POST /api/users/create
//@access public
const createUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (password.length < 4) {
    return res.status(400).send("Password must be at least 4 characters long");
  }

  try {
    // Create a new user
    const user = new User({
      username,
      email,
      password,
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user.password = hashedPassword;

    await user.save();
    res.status(201).json({ _id: user.id, email: user.email });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).send(err.message);
    } else {
      return res.status(500).send(err.message);
    }
  }
});
//@desc refresh token
//@route POST /api/users/token
//@access public
const tokenRefresh = asyncHandler(async (req, res) => {
  const refreshToken = req.body.token;

  if (!refreshToken) {
    return res.status(401).send("Refresh token is missing");
  }

  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET,
    async (err, decoded) => {
      if (err) {
        return res.status(403).send("Refresh token is invalid");
      }

      const userId = decoded.id;

      const user = await User.findById(userId);

      if (!user) {
        return res.status(401).send("User not found");
      }

      const accessToken = generateAccessToken(user);
      return res.status(200).json({ accessToken: accessToken });
    }
  );
});

//@desc Logout user
//@route POST /api/users/logout
//@access public
const logoutUser = asyncHandler(async (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  return res.status(204).send("Success");
});

//@desc Login user
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send("All fields are mandatory!");
  }
  const user = await User.findOne({ email });
  // Compare password with hashed password
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = generateAccessToken(user); // Generate access token using user.toJSON()
    const refreshToken = jwt.sign(
      { id: user.id }, // Include the user ID in the refresh token payload
      process.env.JWT_REFRESH_SECRET
    );
    refreshTokens.push(refreshToken);
    return res
      .status(200)
      .json({ accessToken: accessToken, refreshToken: refreshToken });
  } else {
    return res.status(401).send("Email or password is not valid");
  }
});

//@desc Current user info
//@route GET /api/users/current
//@access private
const currentUser = asyncHandler(async (req, res) => {
  console.log(req.user);
  return res.json(req.user);
});

//@desc Read all users
//@route GET /api/users/getAll
//@access private
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  return res.status(200).json(users);
});

//@desc Delete user
//@route DELETE /api/users/:id
//@access private
const deleteUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send("User not found!");
    }
    await user.deleteOne({ _id: req.params.id });
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    // Handle the error and send an appropriate response
    return res.status(500).json({ error: "Failed to delete user" });
  }
});

//@desc Edit user
//@route PUT /api/users/:id
//@access private
const editUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).send("User not found!");
  }

  if (req.body.email || req.body.password) {
    return res.status(400).send("You can only update the username");
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    { username: req.body.username },
    { new: true }
  );

  return res.status(200).json(updatedUser);
});

//@desc Read user by id
//@route GET /api/users/:id
//@access private
const readIdUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send("User not found!");
    }
    return res.status(200).json(user);
  } catch (error) {
    // Handle the error and send an appropriate response
    return res.status(500).json({ error: "Failed to get user" });
  }
});

module.exports = {
  createUser,
  loginUser,
  currentUser,
  getAllUsers,
  deleteUser,
  editUser,
  readIdUser,
  tokenRefresh,
  logoutUser,
};
