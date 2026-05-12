const express = require("express");
const router = express.Router();
const performanceEvaluationController = require("../controllers/giveRatingController");

// POST route to submit the performance evaluation
router.post(
  "/submit",
  performanceEvaluationController.submitPerformanceEvaluation
);

module.exports = router;
