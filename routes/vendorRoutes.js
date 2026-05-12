const express = require("express");
const router = express.Router();
const { registerVendor } = require("../controllers/vendorController");

// POST request for vendor registration
router.post("/register", registerVendor);

module.exports = router;
