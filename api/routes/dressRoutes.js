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
const validateAdmin = require("../middleware/validateAdmin");

router.use(validateToken);
router.route("/").get(dressReadAll).post(validateAdmin, dressCreate);

router
  .route("/:id")
  .get(dressReadId)
  .put(validateAdmin, dressEdit)
  .delete(validateAdmin, dressDelete);

module.exports = router;
