const express = require("express");
const router = express.Router();
const { priceReadAll, priceEdit } = require("../controllers/priceController");
const validateToken = require("../middleware/validateTokenHandler");
const validateAdmin = require("../middleware/validateAdmin");

router.route("/").get(priceReadAll);

router.route("/:id").put(validateToken, validateAdmin, priceEdit);

module.exports = router;
