const express = require("express");
const router = express.Router();
const db = require("../config/db");
const contractController = require("../controllers/createContract");
const {
  getAllContracts,
  generateReport,
  getContractDetails,
} = require("../controllers/getContractController");

// Route to create a contract
router.post("/contracts", contractController.createContract);

// Route to fetch vendors
router.get("/vendors", (req, res) => {
  const query = "SELECT vendor_id, company_name FROM Vendor";
  db.query(query, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Error fetching vendors.",
      });
    }

    res.status(200).json({
      success: true,
      vendors: result,
    });
  });s
});

// Route to get all contracts
router.get("/contracts", getAllContracts); // Keep this and remove the duplicate route

// Route to get contract details by ID
router.get("/contracts/:contractId", getContractDetails);

// Route to generate report
router.get("/generate-report-contracts", generateReport);

module.exports = router;
