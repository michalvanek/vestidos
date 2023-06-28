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

router.use(validateToken);
router.route("/").get(colorReadAll).post(validateAdmin, colorCreate);

router
  .route("/:id")
  .get(colorReadId)
  .put(validateAdmin, colorEdit)
  .delete(validateAdmin, colorDelete);

module.exports = router;
