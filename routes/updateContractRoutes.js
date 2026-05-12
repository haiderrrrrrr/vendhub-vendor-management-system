const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { updateContract } = require("../controllers/updateContractController");

// Route for updating contract details
router.post("/update", updateContract);

// Route to fetch all contracts (only for this route)
router.get("/contracts", (req, res) => {
  db.query("SELECT * FROM Contract", (err, contracts) => {
    if (err) {
      console.error("Error fetching contracts:", err);
      return res
        .status(500)
        .json({ success: false, message: "Error fetching contracts." });
    }

    res.status(200).json({ success: true, contracts });
  });
});

// Route to fetch contract details by ID (only for this route)
router.get("/contracts/:id", (req, res) => {
  const { id } = req.params;
  db.query(
    "SELECT * FROM Contract WHERE contract_id = ?",
    [id],
    (err, result) => {
      if (err || result.length === 0) {
        console.error("Error fetching contract details:", err);
        return res.status(500).json({
          success: false,
          message: "Error fetching contract details.",
        });
      }

      res.status(200).json({ success: true, contract: result[0] });
    }
  );
});

module.exports = router;
