const express = require("express");
const router = express.Router();
const db = require("../config/db");
const purchaseOrderController = require("../controllers/createPurchaseOrderController");
const getPurchaseOrderController = require("../controllers/getPurchaseOrderController");

// Route to fetch departments
router.get("/departments", purchaseOrderController.getDepartments);

// Route to fetch vendors
router.get("/vendors", purchaseOrderController.getVendors);

// Route to create a purchase order
router.post("/purchase-order", purchaseOrderController.createPurchaseOrder);

// Route to get all purchase orders with their status (triggering stored procedure)
router.get(
  "/get-purchase-orders",
  getPurchaseOrderController.getPurchaseOrders
);

// Route to generate purchase order report (PDF)
router.get(
  "/generate-purchase-orders-report",
  getPurchaseOrderController.generatePurchaseOrderReport
);

module.exports = router;
