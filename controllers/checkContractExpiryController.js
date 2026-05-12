const db = require("../config/db");

// Fetch contracts that are expiring in the next 30 days
const getExpiringContracts = (req, res) => {
  console.log("Received request for expiring contracts");
  const today = new Date().toISOString().slice(0, 10); // Get today's date in YYYY-MM-DD format

  // SQL query to fetch contracts expiring in the next 30 days
  const query = `
    SELECT c.contract_id, c.contract_name, c.end_date, c.contract_value, c.payment_terms, v.company_name AS vendor
    FROM Contract c
    JOIN Vendor v ON c.vendor_id = v.vendor_id
    WHERE c.end_date BETWEEN ? AND DATE_ADD(?, INTERVAL 30 DAY)
  `;

  // Execute the query
  db.query(query, [today, today], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Error fetching expiring contracts from the database.",
      });
    }

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No contracts are expiring soon.",
      });
    }

    // Send the expiring contracts as the response
    res.status(200).json({
      success: true,
      contracts: result,
    });
  });
};

module.exports = { getExpiringContracts };
