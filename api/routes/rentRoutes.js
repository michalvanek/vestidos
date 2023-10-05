const express = require("express");
const router = express.Router();
const {
  rentReadAll,
  rentCreate,
  rentEdit,
  rentDelete,
} = require("../controllers/rentController");
const validateToken = require("../middleware/validateTokenHandler");
const validateAdmin = require("../middleware/validateAdmin");

router.route("/").get(validateToken, validateAdmin, rentReadAll);
router.use(validateToken);
router.route("/").post(validateAdmin, rentCreate);

router
  .route("/:id")
  .put(validateAdmin, rentEdit)
  .delete(validateAdmin, rentDelete);

module.exports = router;
