const express = require("express");
const router = express.Router();
const budgetAlertsController = require("../controllers/budgetAlertController");

// Route to check budget alerts
router.get("/check-budget-alerts", budgetAlertsController.checkBudgetAlerts);

module.exports = router;
