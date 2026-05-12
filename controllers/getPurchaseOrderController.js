const { jsPDF } = require("jspdf");
const fs = require("fs");
const path = require("path");
const db = require("../config/db");
require("jspdf-autotable");

// Get purchase orders for the report
const getPurchaseOrders = (req, res) => {
  db.query("CALL TrackPurchaseOrdersStatus()", (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Error fetching purchase orders from the database.",
      });
    }

    const purchaseOrders = result[0]; // Assuming result[0] is the purchase orders
    const purchaseOrderItems = Array.isArray(result[1]) ? result[1] : [];

    // Check if purchaseOrderItems is an array before proceeding
    if (!Array.isArray(purchaseOrderItems)) {
      console.error("Error: Items data is not an array:", result[1]);
      return res.status(500).json({
        success: false,
        message: "Error: Items data is not in the expected format.",
      });
    }

    // Map over the result to include item details
    const formattedPurchaseOrders = purchaseOrders.map((po) => ({
      po_id: po.po_id || "N/A",
      department_name: po.department_name || "N/A",
      vendor_name: po.vendor_name || "N/A",
      po_date: po.po_date || "N/A",
      total_cost: po.total_cost || "N/A",
      approval_status: po.approval_status || "N/A",
      status: po.status || "N/A",
      status_color: po.status_color || "white",
      items: purchaseOrderItems
        .filter((item) => item.po_id === po.po_id) // Filter for items based on PO ID
        .map((item) => ({
          item_description: item.item_description || "N/A",
          quantity: item.quantity || "N/A",
          unit_price: item.unit_price || "N/A",
          item_total_cost: item.item_total_cost || "N/A",
        })),
    }));

    // Return purchase orders with item details
    res.status(200).json(formattedPurchaseOrders);
  });
};

// Generate PDF report for purchase orders
const generatePurchaseOrderReport = (req, res) => {
  try {
    // Create new jsPDF instance
    const doc = new jsPDF();

    // Path to your template image (adjust as per your path)
    const templatePath = path.join(
      __dirname,
      "../public/assets", // Adjust to the location of your image
      "templateDoc.png"
    );

    // Check if the template image exists
    if (!fs.existsSync(templatePath)) {
      console.error("Template image not found");
      return res.status(404).json({ message: "Template image not found" });
    }

    // Read the image file (ensure it's a supported format like PNG/JPEG)
    const imgData = fs.readFileSync(templatePath);
    doc.addImage(imgData, "PNG", 0, 0, 210, 297); // A4 size (210mm x 297mm)

    // Add title with elegant color and centered text
    doc.setFont("helvetica", "bold");
    doc.setFontSize(26);
    doc.setTextColor(0, 102, 204); // Blue color (RGB)
    doc.text("Purchase Order Report", 105, 40, { align: "center" });

    // Fetch the purchase orders data from the database
    db.query("CALL TrackPurchaseOrdersStatus()", (err, result) => {
      if (err) {
        console.error("Error fetching purchase orders:", err);
        return res.status(500).json({
          success: false,
          message: "Error fetching purchase orders.",
        });
      }

      const purchaseOrders = result[0];
      const purchaseOrderItems = Array.isArray(result[1]) ? result[1] : [];

      // Check if purchaseOrderItems is an array before proceeding
      if (!Array.isArray(purchaseOrderItems)) {
        console.error("Error: Items data is not an array:", result[1]);
        return res.status(500).json({
          success: false,
          message: "Error: Items data is not in the expected format.",
        });
      }

      // Prepare the table data, including items
      const tableData = purchaseOrders.map((po) => [
        po.po_id || "N/A",
        po.department_name || "N/A",
        po.vendor_name || "N/A",
        po.po_date || "N/A",
        po.total_cost || "N/A",
        po.approval_status || "N/A",
      ]);

      // Define table columns (headers)
      const columns = [
        "PO ID",
        "Department Name",
        "Vendor Name",
        "PO Date",
        "Total Cost",
        "Approval Status",
      ];

      // Add the table to the PDF with custom design
      doc.autoTable(columns, tableData, {
        startY: 65, // Start the table below the title
        margin: { top: 10 },
        theme: "grid",
        headStyles: {
          fillColor: [0, 102, 204], // Blue color for the header row
          textColor: [255, 255, 255], // White text for the header
          fontSize: 12,
          halign: "center",
          fontStyle: "bold", // Make the header text bold
          lineWidth: 0.5,
          lineColor: [255, 255, 255], // White lines
        },
        bodyStyles: {
          fontSize: 11,
          halign: "center",
          lineColor: [200, 200, 200], // Light gray for body lines
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240], // Light gray rows for better readability
        },
        didDrawPage: function (data) {
          // Additional content like page numbers or custom header/footer can go here
        },
      });

      // Footer with a soft red color
      doc.setFont("helvetica", "italic");
      doc.setFontSize(12);
      doc.setTextColor(255, 87, 34); // Red color (RGB)
      doc.text(
        "Authorized By: Haider Ali and Danish Nadeem",
        105,
        doc.internal.pageSize.height - 20,
        {
          align: "center",
        }
      );

      // Output as a PDF and send as a response
      const pdfBuffer = doc.output("arraybuffer");

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=purchase_orders_report.pdf"
      );
      res.end(Buffer.from(pdfBuffer));
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return res.status(500).json({
      success: false,
      message: "Error generating the purchase orders report.",
    });
  }
};

module.exports = { getPurchaseOrders, generatePurchaseOrderReport };
