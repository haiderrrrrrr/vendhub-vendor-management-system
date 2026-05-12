const express = require("express");
const router = express.Router();
const vendorController = require("../controllers/updateVendorController");

// Route to get all vendors for the dropdown
router.get("/vendors", vendorController.getVendors);

// Route to fetch details of a specific vendor
router.get("/vendor/:vendorId", vendorController.getVendorDetails);

// Route to update vendor details
router.post("/update-vendor", vendorController.updateVendorDetails);

module.exports = router;
