const { jsPDF } = require("jspdf");
const fs = require("fs");
const path = require("path");

const generateReport = (req, res) => {
  try {
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

    // Add title with red color and centered text
    doc.setFont("helvetica", "bold"); // Bold font for the title
    doc.setFontSize(22);
    doc.setTextColor(255, 0, 0); // Red color (RGB)
    doc.text("Vendhub System Report", 105, 30, { align: "center" }); // Centered heading

    // Add static introductory line with black color
    doc.setFont("helvetica", "normal"); // Regular font for text
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Black color (RGB)
    doc.text(
      "Here is the report of information you have requested for.",
      10,
      50
    ); // Static text

    // Leave space for dynamic content with black color
    doc.text("Dynamic content will go here...", 10, 60);

    // Add footer with red color and developer's name
    doc.setFont("helvetica", "italic"); // Italic font for footer
    doc.setFontSize(12);
    doc.setTextColor(255, 0, 0); // Red color (RGB)
    doc.text("Authorized By: Haider Ali and Danish Nadeem", 105, 280, {
      align: "center",
    }); // Centered footer

    // Output as a PDF and send as a response
    const pdfBuffer = doc.output("arraybuffer");

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=report.pdf");

    res.end(Buffer.from(pdfBuffer));
  } catch (error) {
    console.error("Error generating PDF:", error);
    return res.status(500).json({
      success: false,
      message: "Error generating the report.",
    });
  }
};

module.exports = { generateReport };
