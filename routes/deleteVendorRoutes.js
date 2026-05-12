const express = require("express");
const router = express.Router();
const vendorController = require("../controllers/deleteVendorController");

// Route to get list of vendors
router.get("/vendors", vendorController.getVendors);

// Route to delete a vendor by ID
router.delete("/vendors/:vendorId", vendorController.deleteVendor);

module.exports = router;
