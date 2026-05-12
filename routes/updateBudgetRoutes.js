const express = require("express");
const router = express.Router();
const budgetController = require("../controllers/updateBudgetController");

// Get all departments
router.get("/departments", budgetController.getDepartments);

// Get budget details by department ID
router.get("/budget/:deptId", budgetController.getBudgetByDepartment);

// Update the budget for a department
router.post("/budget/update", budgetController.updateBudget);

module.exports = router;
