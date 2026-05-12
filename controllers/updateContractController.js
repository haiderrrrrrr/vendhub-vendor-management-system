const db = require("../config/db"); // Import the db connection

// Function to update a contract
const updateContract = (req, res) => {
  const {
    contract_id,
    vendor_id,
    contract_name,
    contract_terms,
    start_date,
    end_date,
    contract_value,
    payment_terms,
  } = req.body;

  // Validate input fields
  if (
    !contract_id ||
    !vendor_id ||
    !contract_name ||
    !contract_terms ||
    !start_date ||
    !end_date ||
    !contract_value ||
    !payment_terms
  ) {
    return res.status(400).json({
      success: false,
      message: "All fields are required.",
    });
  }

  // Query to call stored procedure UpdateContract
  const query = `
    CALL UpdateContract(?, ?, ?, ?, ?, ?, ?, ?);
  `;

  // Execute the query with the parameters
  db.query(
    query,
    [
      contract_id,
      contract_name,
      vendor_id,
      contract_terms,
      start_date,
      end_date,
      contract_value,
      payment_terms,
    ],
    (err) => {
      if (err) {
        console.error("Error executing stored procedure:", err);
        return res.status(500).json({
          success: false,
          message: "Error updating contract.",
        });
      }

      res.status(200).json({
        success: true,
        message: "Contract updated successfully.",
      });
    }
  );
};

module.exports = { updateContract };
