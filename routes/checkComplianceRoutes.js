const express = require("express");
const router = express.Router();
const {
  getVendors,
  checkCompliance,
} = require("../controllers/checkComplianceController"); // Import both functions

// Route to fetch all vendors
router.get("/vendors", getVendors);

// Route to check vendor compliance certification
router.get("/check-compliance/:vendorId", checkCompliance);

module.exports = router;
