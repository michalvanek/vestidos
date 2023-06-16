const express = require("express");
const router = express.Router();
const {
  dressReadAll,
  dressCreate,
  dressReadId,
  dressEdit,
  dressDelete,
} = require("../controllers/dressController");
const validateToken = require("../middleware/validateTokenHandler");

router.use(validateToken);
router.route("/").get(dressReadAll).post(dressCreate);

router.route("/:id").get(dressReadId).put(dressEdit).delete(dressDelete);

module.exports = router;
