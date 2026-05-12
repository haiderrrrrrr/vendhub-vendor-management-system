const express = require("express");
const router = express.Router();
const db = require("../config/db");
const {
  getExpiringContracts,
} = require("../controllers/checkContractExpiryController");

// Define the route to get expiring contracts
router.get("/expiring-contracts", getExpiringContracts);

module.exports = router;
