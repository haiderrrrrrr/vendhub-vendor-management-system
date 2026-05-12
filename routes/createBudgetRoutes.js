// routes/budgetRoutes.js
const express = require("express");
const db = require("../config/db");
const router = express.Router();
const {
  createBudgetAndDepartment,
} = require("../controllers/createBudgetController");

// POST route to create department and budget
router.post("/create-budget", createBudgetAndDepartment);

module.exports = router;
