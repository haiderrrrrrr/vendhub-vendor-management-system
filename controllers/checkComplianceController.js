const db = require("../config/db");

const getVendors = (req, res) => {
  const query = `SELECT vendor_id, company_name FROM Vendor`;
  console.log("Fetching vendors...");

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching vendors:", err);
      return res.status(500).json({
        success: false,
        message: "Error fetching vendors from database.",
      });
    }

    console.log("Vendors fetched:", results);
    return res.status(200).json(results);
  });
};

const checkCompliance = (req, res) => {
  const { vendorId } = req.params;
  console.log(`Checking compliance for vendor: ${vendorId}`);

  const query = `
      SELECT c.certification_name, c.issued_by, c.issue_date
      FROM ComplianceCertification c
      WHERE c.vendor_id = ? 
    `;

  db.query(query, [vendorId], (err, results) => {
    if (err) {
      console.error("Error checking compliance:", err);
      return res.status(500).json({
        success: false,
        message: "Database query error while checking compliance.",
      });
    }

    if (results.length > 0) {
      console.log("Compliance found:", results);
      return res.status(200).json({
        success: true,
        message: "Vendor meets compliance certification criteria.",
        certifications: results,
      });
    } else {
      console.log("No compliance found.");
      return res.status(200).json({
        success: false,
        message:
          "Vendor does not align with compliance certification criteria.",
      });
    }
  });
};

module.exports = { getVendors, checkCompliance };
