const express = require("express");
const router = express.Router();
const {
  getPerformanceEvaluations,
  generatePerformanceReport,
} = require("../controllers/getRatingController");

// Route to get performance evaluation for a specific vendor
router.get("/performance/:vendorId", getPerformanceEvaluations);

// Route to generate performance report for a specific vendor
router.get("/generate-performance-report/:vendorId", generatePerformanceReport);

module.exports = router;
