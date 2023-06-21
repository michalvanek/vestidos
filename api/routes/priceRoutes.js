const express = require("express");
const router = express.Router();
const { priceReadAll, priceEdit } = require("../controllers/priceController");
const validateToken = require("../middleware/validateTokenHandler");
const validateAdmin = require("../middleware/validateAdmin");

router.use(validateToken);
router.route("/").get(priceReadAll);

router.route("/:id").put(validateAdmin, priceEdit);

module.exports = router;
