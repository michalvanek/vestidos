const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { default: mongoose } = require("mongoose");
const RefreshToken = require("../models/refreshTokenModel");
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

  try {
    // Check if the refresh token exists in the database
    const existingToken = await RefreshToken.findOne({ token: refreshToken });

    if (!existingToken) {
      return res.status(403).send("Refresh token is invalid");
    }

    // Verify the refresh token and extract the user ID
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const userId = decoded.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).send("User not found");
    }

    const accessToken = generateAccessToken(user);
    return res.status(200).json({ accessToken: accessToken });
  } catch (err) {
    return res.status(500).send("Error refreshing token");
  }
});

//@desc Logout user
//@route POST /api/users/logout
//@access public
const logoutUser = asyncHandler(async (req, res) => {
  const refreshToken = req.body.token;

  if (!refreshToken) {
    return res.status(401).send("Refresh token is missing");
  }

  try {
    // Find the user ID associated with the refresh token
    const tokenDoc = await RefreshToken.findOne({ token: refreshToken });
    if (!tokenDoc) {
      return res.status(401).send("Refresh token is invalid");
    }
    const userId = tokenDoc.userId;

    // Delete all refresh tokens associated with the user ID
    await RefreshToken.deleteMany({ userId });

    // Clear the access token and refresh token cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res.status(204).send("Success");
  } catch (err) {
    return res.status(500).send("Error logging out");
  }
});

//@desc Login user
//@route POST /api/users/login
//@access public
//@desc Login user
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send("All fields are mandatory!");
  }
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
    );

    try {
      const refreshTokenDoc = new RefreshToken({
        token: refreshToken,
        userId: user.id,
      });
      await refreshTokenDoc.save();

      // Set HTTP-only cookies in the response
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true, // Enable this if your server uses HTTPS
        sameSite: "strict", // Adjust sameSite attribute based on your requirements
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true, // Enable this if your server uses HTTPS
        sameSite: "strict", // Adjust sameSite attribute based on your requirements
      });

      res
        .status(200)
        .json({ accessToken: accessToken, refreshToken: refreshToken });
    } catch (err) {
      res.status(500).send(err.message);
    }
  } else {
    res.status(401).send("Email or password is not valid");
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
