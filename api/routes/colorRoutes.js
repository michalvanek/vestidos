const express = require("express");
const router = express.Router();
const {
  colorReadAll,
  colorCreate,
  colorReadId,
  colorEdit,
  colorDelete,
} = require("../controllers/colorController");
const validateToken = require("../middleware/validateTokenHandler");
const validateAdmin = require("../middleware/validateAdmin");

router
  .route("/")
  .get(colorReadAll)
  .post(validateToken, validateAdmin, colorCreate);

router
  .route("/:id")
  .get(colorReadId)
  .put(validateToken, validateAdmin, colorEdit)
  .delete(validateToken, validateAdmin, colorDelete);

module.exports = router;
