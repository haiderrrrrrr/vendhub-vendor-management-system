const db = require("../config/db");

// Function to create a contract
const createContract = (req, res) => {
  const {
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
    !vendor_id ||
    !contract_name ||
    !contract_terms ||
    !start_date ||
    !end_date ||
    !contract_value ||
    !payment_terms
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // SQL query to call the stored procedure
  const query = `
    CALL CreateContract(?, ?, ?, ?, ?, ?, ?)
  `;

  // Use connection.query instead of execute for mysql package
  db.query(
    query,
    [
      vendor_id,
      contract_name,
      contract_terms,
      start_date,
      end_date,
      contract_value,
      payment_terms,
    ],
    (err, results) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ message: "Error creating contract", error: err });
      }

      // If successful, return the result
      res.status(200).json({
        message: "Contract created successfully",
        contract: results,
      });
    }
  );
};

module.exports = {
  createContract,
};
