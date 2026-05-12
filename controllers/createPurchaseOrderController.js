const db = require("../config/db");

// Fetch departments
const getDepartments = (req, res) => {
  db.query(
    "SELECT department_id, department_name FROM Department;",
    (err, departmentResults) => {
      if (err) {
        console.error("Error fetching departments:", err);
        return res
          .status(500)
          .json({ success: false, message: "Error fetching departments." });
      }
      console.log("Fetched departments:", departmentResults);
      res.status(200).json({ success: true, departments: departmentResults });
    }
  );
};

// Fetch vendors
const getVendors = (req, res) => {
  db.query(
    "SELECT vendor_id, company_name FROM Vendor",
    (err, vendorResults) => {
      if (err) {
        console.error("Error fetching vendors:", err);
        return res
          .status(500)
          .json({ success: false, message: "Error fetching vendors." });
      }
      console.log("Fetched vendors:", vendorResults);
      res.status(200).json({ success: true, vendors: vendorResults });
    }
  );
};

// Logic for creating a purchase order
const createPurchaseOrder = (req, res) => {
  const {
    department_id,
    vendor_id,
    po_date,
    total_cost,
    approval_status,
    items,
  } = req.body;

  // Validate required fields
  if (
    !department_id ||
    !vendor_id ||
    !po_date ||
    !total_cost ||
    !approval_status ||
    !items || // Ensure items is provided and is an array
    !Array.isArray(items) ||
    items.length === 0
  ) {
    return res.status(400).json({
      success: false,
      message: "All fields are required, including at least one item.",
    });
  }

  // Prepare the items as a JSON array for the stored procedure
  const itemsJson = JSON.stringify(items);

  // Call the stored procedure to create the purchase order
  db.query(
    "CALL CreatePurchaseOrder(?, ?, ?, ?, ?, ?)",
    [department_id, vendor_id, po_date, total_cost, approval_status, itemsJson],
    (err, results) => {
      if (err) {
        console.error("Database query error:", err);
        return res
          .status(500)
          .json({ success: false, message: "Error creating purchase order." });
      }

      res.status(201).json({
        success: true,
        message: "Purchase order created successfully.",
      });
    }
  );
};

module.exports = { getDepartments, getVendors, createPurchaseOrder };
