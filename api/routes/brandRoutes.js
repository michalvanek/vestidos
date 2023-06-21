const express = require("express");
const router = express.Router();
const {
  brandReadAll,
  brandCreate,
  brandReadId,
  brandEdit,
  brandDelete,
} = require("../controllers/brandController");
const validateToken = require("../middleware/validateTokenHandler");
const validateAdmin = require("../middleware/validateAdmin");

router.use(validateToken);
router.route("/").get(brandReadAll).post(validateAdmin, brandCreate);

router
  .route("/:id")
  .get(brandReadId)
  .put(validateAdmin, brandEdit)
  .delete(validateAdmin, brandDelete);

module.exports = router;
