const connection = require("../config/db");

// Controller to handle the stored procedure call
const createBudgetAndDepartment = (req, res) => {
  const { department_name, allocated_amount, spent_amount, year } = req.body;

  // Call the stored procedure AddBudgetAndDepartment
  const query = `
    CALL AddBudgetAndDepartment(?, ?, ?, ?);
  `;

  // Execute the stored procedure
  connection.query(
    query,
    [department_name, allocated_amount, spent_amount, year],
    (err, results) => {
      if (err) {
        return res.status(500).json({
          error: "Failed to create department and budget",
          details: err,
        });
      }

      // Return the success message from the stored procedure
      const successMessage = results[0][0].message; // Assuming the message is in the first row of the result
      res.status(200).json({ message: successMessage });
    }
  );
};

module.exports = {
  createBudgetAndDepartment,
};
