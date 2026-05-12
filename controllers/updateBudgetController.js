const db = require("../config/db"); // Import the db connection

// Fetch all departments
const getDepartments = (req, res) => {
  const query = "SELECT department_id, department_name FROM Department";
  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching departments:", err);
      return res
        .status(500)
        .json({ success: false, message: "Error fetching departments." });
    }
    res.status(200).json({ success: true, departments: result });
  });
};

// Fetch budget details by department ID
const getBudgetByDepartment = (req, res) => {
  const deptId = req.params.deptId;

  const query = `
    SELECT allocated_amount, spent_amount, year 
    FROM Budget 
    WHERE department_id = ?
  `;

  db.query(query, [deptId], (err, result) => {
    if (err) {
      console.error("Error fetching budget details:", err);
      return res
        .status(500)
        .json({ success: false, message: "Error fetching budget details." });
    }

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Budget not found for the selected department.",
      });
    }

    res.status(200).json({ success: true, budget: result[0] });
  });
};

// Update budget details for a department
const updateBudget = (req, res) => {
  const { department_id, allocated_amount, spent_amount, year } = req.body;

  // Validate input fields
  if (
    !department_id ||
    allocated_amount == null ||
    spent_amount == null ||
    !year
  ) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required." });
  }

  // Query to call the stored procedure to update the budget for a department
  const query = `
    CALL UpdateBudgetByDepartmentId(?, ?, ?, ?)
  `;

  db.query(
    query,
    [department_id, allocated_amount, spent_amount, year],
    (err) => {
      if (err) {
        console.error("Error executing stored procedure:", err);
        return res
          .status(500)
          .json({ success: false, message: "Error updating budget." });
      }

      res
        .status(200)
        .json({ success: true, message: "Budget updated successfully." });
    }
  );
};

module.exports = { getDepartments, getBudgetByDepartment, updateBudget };
