const express = require("express");
const router = express.Router();
const {
  eventReadAll,
  eventCreate,
  eventEdit,
  eventDelete,
} = require("../controllers/eventController");
const validateToken = require("../middleware/validateTokenHandler");
const validateAdmin = require("../middleware/validateAdmin");

router.route("/").get(validateToken, validateAdmin, eventReadAll);
router.use(validateToken);
router.route("/").post(validateAdmin, eventCreate);

router
  .route("/:id")
  .put(validateAdmin, eventEdit)
  .delete(validateAdmin, eventDelete);

module.exports = router;
