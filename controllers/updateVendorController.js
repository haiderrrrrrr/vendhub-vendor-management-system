const db = require("../config/db");

// Fetch all vendors for the dropdown
const getVendors = (req, res) => {
  db.query("SELECT vendor_id, company_name FROM Vendor", (err, result) => {
    if (err) {
      console.error("Error fetching vendors:", err);
      return res.status(500).json({
        success: false,
        message: "Error fetching vendors.",
      });
    }

    if (result.length > 0) {
      return res.json({
        success: true,
        vendors: result,
      });
    } else {
      return res.json({
        success: false,
        message: "No vendors found.",
      });
    }
  });
};

// Fetch Vendor Details for the selected vendor
const getVendorDetails = (req, res) => {
  const { vendorId } = req.params;

  // Ensure vendorId is treated as a number for comparison
  const vendorIdInt = parseInt(vendorId, 10);
  if (isNaN(vendorIdInt)) {
    return res.status(400).json({
      success: false,
      message: "Invalid vendor ID.",
    });
  }

  // Query to fetch vendor details (replace with your actual stored procedure)
  db.query("CALL GetVendorDetails(?)", [vendorIdInt], (err, result) => {
    if (err) {
      console.error("Error fetching vendor details:", err);
      return res.status(500).json({
        success: false,
        message: "Error fetching vendor details.",
      });
    }

    if (result.length > 0) {
      return res.json({
        success: true,
        vendor: result[0][0], // Adjust according to your SP result format
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Vendor not found.",
      });
    }
  });
};

// Update Vendor Details
const updateVendorDetails = (req, res) => {
  const {
    vendorId,
    companyName,
    serviceCategory,
    contactName,
    phoneNumber,
    contactEmail,
    address,
    certificationName,
    issuedBy,
    issueDate,
  } = req.body;

  // Query to call the stored procedure to update the vendor
  db.query(
    "CALL UpdateUserDetails(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      vendorId,
      companyName,
      serviceCategory,
      contactName,
      phoneNumber,
      contactEmail,
      address,
      certificationName,
      issuedBy,
      issueDate,
    ],
    (err, result) => {
      if (err) {
        console.error("Error updating vendor:", err);
        return res.status(500).json({
          success: false,
          message: "Error updating vendor details.",
        });
      }

      return res.json({
        success: true,
        message: "Vendor details updated successfully.",
      });
    }
  );
};

module.exports = {
  getVendors,
  getVendorDetails,
  updateVendorDetails,
};
