const db = require("../config/db");

// Controller to check budget alerts
const checkBudgetAlerts = (req, res) => {
  // SQL query to get purchase orders that have exceeded the budget
  const query = `
    SELECT po.po_id, po.department_id, po.total_cost, ba.alert_message, ba.created_at
    FROM BudgetAlert ba
    JOIN PurchaseOrder po ON ba.po_id = po.po_id
    WHERE po.total_cost > (
        SELECT budget_amount FROM DepartmentBudget WHERE department_id = po.department_id
    )
    ORDER BY ba.created_at DESC;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching budget alerts:", err);
      return res
        .status(500)
        .json({ message: "Failed to fetch budget alerts." });
    }
    return res.json(results); // Return results as JSON
  });
};

module.exports = { checkBudgetAlerts };
