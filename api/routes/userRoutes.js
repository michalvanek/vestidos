const express = require("express");
const {
  createUser,
  currentUser,
  loginUser,
  getAllUsers,
  deleteUser,
  editUser,
  readIdUser,
  tokenRefresh,
  logoutUser,
} = require("../controllers/userController");
const validateToken = require("../middleware/validateTokenHandler");
const validateAdmin = require("../middleware/validateAdmin");

const router = express.Router();

router.post("/create", createUser); //add validateToken, validateAdmin to restrict just for Admin user

router.post("/login", loginUser);

router.delete("/logout", logoutUser);

router.post("/token", tokenRefresh);

router.get("/current", validateToken, currentUser);

router.get("/getAll", validateToken, getAllUsers);

router.delete("/:id", validateToken, validateAdmin, deleteUser);

router.put("/:id", validateToken, validateAdmin, editUser);

router.get("/:id", validateToken, validateAdmin, readIdUser);

module.exports = router;
