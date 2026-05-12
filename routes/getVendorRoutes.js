const express = require("express");
const router = express.Router();
const vendorController = require("../controllers/getVendorController");

// Get all vendors for dropdown
router.get("/vendors", vendorController.getVendors);

// Get vendor details by ID
router.get("/vendor/:vendorId", vendorController.getVendorDetails);

// Generate PDF report for a vendor
router.get(
  "/generate-vendor-report/:vendorId",
  vendorController.generateVendorReport
);

module.exports = router;
