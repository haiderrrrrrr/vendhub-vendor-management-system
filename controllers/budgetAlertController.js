const db = require("../config/db"); 

// Controller to check budget alerts for Purchase Orders exceeding the department's remaining budget
const checkBudgetAlerts = (req, res) => {
  // SQL query to get purchase orders that have exceeded the department's remaining budget
  const query = `
    SELECT 
      po.po_id,
      po.department_id,
      po.vendor_id,
      po.po_date,
      po.total_cost,
      po.approval_status,
      po.budget_compliance,
      b.remaining_amount AS department_remaining_budget
    FROM 
      PurchaseOrder po
    JOIN 
      Budget b ON po.department_id = b.department_id
    WHERE 
      po.total_cost > b.remaining_amount;
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
