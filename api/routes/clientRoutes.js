const express = require("express");
const router = express.Router();
const {
  clientReadAll,
  clientCreate,
  clientEdit,
  clientDelete,
} = require("../controllers/clientController");
const validateToken = require("../middleware/validateTokenHandler");
const validateAdmin = require("../middleware/validateAdmin");

router.route("/").get(validateToken, validateAdmin, clientReadAll);
router.use(validateToken);
router.route("/").post(validateAdmin, clientCreate);

router
  .route("/:id")
  .put(validateAdmin, clientEdit)
  .delete(validateAdmin, clientDelete);

module.exports = router;
