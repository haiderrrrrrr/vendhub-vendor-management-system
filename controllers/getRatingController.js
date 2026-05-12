const { jsPDF } = require("jspdf");
const fs = require("fs");
const path = require("path");
const db = require("../config/db");

// Fetch vendors
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

// Fetch Performance Evaluations for a specific vendor
const getPerformanceEvaluations = (req, res) => {
  const { vendorId } = req.params;

  // Call the stored procedure to get performance data
  db.query("CALL GetPerformanceEvaluations(?)", [vendorId], (err, result) => {
    if (err) {
      console.error("Error fetching performance evaluations:", err);
      return res.status(500).json({
        success: false,
        message: "Error fetching performance evaluations.",
      });
    }

    if (result[0].length > 0) {
      const performance = result[0][0]; // Assuming there's only one result per vendor
      return res.json({
        success: true,
        performance: {
          vendor_name: performance.company_name,
          rating: performance.rating,
          feedback: performance.feedback,
          improvement_notes: performance.improvement_notes,
          evaluation_date: performance.evaluation_date,
          evaluator_name: performance.evaluator,
        },
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Performance evaluation not found for this vendor.",
      });
    }
  });
};

const generatePerformanceReport = (req, res) => {
  // Create new jsPDF instance
  const doc = new jsPDF();

  // Path to your template image (adjust as per your path)
  const templatePath = path.join(
    __dirname,
    "../public/assets",
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

  const { vendorId } = req.params;

  // Call the stored procedure to get performance data
  db.query("CALL GetPerformanceEvaluations(?)", [vendorId], (err, result) => {
    if (err) {
      console.error("Error fetching performance evaluations:", err);
      return res.status(500).json({
        success: false,
        message: "Error fetching performance evaluations.",
      });
    }

    if (result[0].length > 0) {
      const performance = result[0][0]; // Assuming there's only one result per vendor

      // Add Title and Main Heading
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(0, 102, 204); // Blue color (RGB)
      doc.text("Performance Evaluation Report", 105, 20, { align: "center" });

      // Add a Line Separator for visual style
      doc.setLineWidth(0.5);
      doc.line(20, 25, 190, 25); // Horizontal line
      doc.setLineWidth(1);

      // Add Vendor Info Heading
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0); // Black color
      doc.text("Vendor Information", 20, 40);

      // Add Vendor Info Details
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text(`Vendor: ${performance.company_name}`, 20, 50);
      doc.text(`Rating: ${performance.rating}`, 20, 60);
      doc.text(`Feedback: ${performance.feedback}`, 20, 70);
      doc.text(`Improvement Notes: ${performance.improvement_notes}`, 20, 80);
      doc.text(`Evaluation Date: ${performance.evaluation_date}`, 20, 90);
      doc.text(`Evaluator: ${performance.evaluator}`, 20, 100);

      // Finalize PDF and send as response
      const pdfOutput = doc.output("arraybuffer");
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=Performance_Report.pdf"
      );
      res.send(Buffer.from(pdfOutput));
    } else {
      return res.status(404).json({
        success: false,
        message: "Performance evaluation not found for this vendor.",
      });
    }
  });
};

module.exports = {
  getPerformanceEvaluations,
  generatePerformanceReport,
  getVendors,
};
