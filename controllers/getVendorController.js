const { jsPDF } = require("jspdf");
const fs = require("fs");
const path = require("path");
const db = require("../config/db");

// Fetch vendors for the dropdown
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

// Fetch Vendor Details
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

  // Call the stored procedure to get vendor details
  db.query("CALL GetAllVendorDetails()", (err, result) => {
    if (err) {
      console.error("Error fetching vendor details:", err);
      return res.status(500).json({
        success: false,
        message: "Error fetching vendor details.",
      });
    }

    console.log("Query Result:", result);

    // Find the vendor by the vendorId
    const vendorDetails = result[0].find(
      (vendor) => vendor.vendor_id === vendorIdInt
    );

    if (vendorDetails) {
      return res.json({
        success: true,
        vendor: vendorDetails,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Vendor details not found.",
      });
    }
  });
};

// Generate PDF Report for Vendor
const generateVendorReport = (req, res) => {
  const { vendorId } = req.params;

  // Ensure vendorId is treated as a number for comparison
  const vendorIdInt = parseInt(vendorId, 10);
  if (isNaN(vendorIdInt)) {
    return res.status(400).json({
      success: false,
      message: "Invalid vendor ID.",
    });
  }

  const doc = new jsPDF();

  // Call the stored procedure to get vendor details for the report
  db.query("CALL GetAllVendorDetails()", (err, result) => {
    if (err) {
      console.error("Error fetching vendor details:", err);
      return res.status(500).json({
        success: false,
        message: "Error fetching vendor details.",
      });
    }

    // Find the vendor by the vendorId
    const vendorDetails = result[0].find(
      (vendor) => vendor.vendor_id === vendorIdInt
    );

    if (vendorDetails) {
      // Add Vendor Info to PDF
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(0, 102, 204); // Blue color
      doc.text("Vendor Details Report", 105, 20, { align: "center" });

      // Add vendor information to the report
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0); // Black color
      doc.text("Vendor Information", 20, 40);

      // Set regular font for details
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text(`Vendor ID: ${vendorDetails.vendor_id}`, 20, 50);
      doc.text(`Company Name: ${vendorDetails.company_name}`, 20, 60);
      doc.text(`Service Category: ${vendorDetails.service_category}`, 20, 70);
      doc.text(`Registration Date: ${vendorDetails.registration_date}`, 20, 80);

      // Add contact info with bold heading
      doc.setFont("helvetica", "bold");
      doc.text("Contact Info", 20, 90);

      // Set regular font for contact details
      doc.setFont("helvetica", "normal");
      doc.text(`Contact Name: ${vendorDetails.contact_name}`, 20, 100);
      doc.text(`Phone Number: ${vendorDetails.phone_number}`, 20, 110);
      doc.text(`Email: ${vendorDetails.contact_email}`, 20, 120);
      doc.text(`Address: ${vendorDetails.contact_address}`, 20, 130);
      doc.text(`Contact Type: ${vendorDetails.contact_type}`, 20, 140);

      // Add compliance certifications with bold heading
      doc.setFont("helvetica", "bold");
      doc.text("Compliance Certifications", 20, 150);

      // Set regular font for certification details
      doc.setFont("helvetica", "normal");
      doc.text(
        `Certification Name: ${vendorDetails.certification_name}`,
        20,
        160
      );
      doc.text(`Issued By: ${vendorDetails.issued_by}`, 20, 170);
      doc.text(`Issue Date: ${vendorDetails.issue_date}`, 20, 180);

      // Finalize PDF and send as response
      const pdfOutput = doc.output("arraybuffer");
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=Vendor_Report_${vendorId}.pdf`
      );
      res.send(Buffer.from(pdfOutput));
    } else {
      return res.status(404).json({
        success: false,
        message: "Vendor details not found.",
      });
    }
  });
};

module.exports = {
  getVendors,
  getVendorDetails,
  generateVendorReport,
};
