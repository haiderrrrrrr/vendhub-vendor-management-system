const express = require("express");
const router = express.Router();
const budgetReportController = require("../controllers/getBudgetController");

// Get all departments
router.get("/departments", budgetReportController.getDepartments);

// Get budget report for a specific department
router.get(
  "/budget-report/:departmentId",
  budgetReportController.getBudgetReport
);

// Generate PDF report for the specific department's budget
router.get(
  "/generate-budget-report/:departmentId",
  budgetReportController.generateBudgetReportPDF
);

module.exports = router;
