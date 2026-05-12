const db = require("../config/db");

// Function to fetch the list of vendors
const getVendors = (req, res) => {
  const query = "SELECT vendor_id, company_name FROM Vendor";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching vendors:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch vendors from the database.",
      });
    }

    res.status(200).json(results); // Send the list of vendors
  });
};

// Function to delete a selected vendor
const deleteVendor = (req, res) => {
  const { vendorId } = req.params;

  // Log incoming request for debugging
  console.log(`Received request to delete vendor with ID: ${vendorId}`);

  // Validate if vendorId exists
  if (!vendorId) {
    return res.status(400).json({
      success: false,
      message: "Vendor ID is required.",
    });
  }

  // Query to call the stored procedure to delete the vendor
  const deleteVendorQuery = "CALL ListAndDeleteVendor(?)";

  db.query(deleteVendorQuery, [vendorId], (err, results) => {
    if (err) {
      console.error("Error deleting vendor:", err);
      return res.status(500).json({
        success: false,
        message: "Database query error during vendor deletion.",
      });
    }

    // Check if the expected message exists in the result
    if (results && results[0] && results[0][0] && results[0][0].message) {
      const message = results[0][0].message; // Retrieve message from stored procedure

      if (message.includes("not found")) {
        return res.status(404).json({
          success: false,
          message: message,
        });
      }

      // Vendor deleted successfully
      return res.status(200).json({
        success: true,
        message: message,
      });
    } else {
      // If the message is not found in the results
      console.error("Unexpected results structure:", results);
      return res.status(500).json({
        success: false,
        message: "User Deleted Successfully",
      });
    }
  });
};

module.exports = { getVendors, deleteVendor };
