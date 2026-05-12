const { jsPDF } = require("jspdf");
const fs = require("fs");
const path = require("path");
const db = require("../config/db"); 

// Fetch departments
const getDepartments = (req, res) => {
  db.query(
    "SELECT department_id, department_name FROM Department",
    (err, result) => {
      if (err) {
        console.error("Error fetching departments:", err);
        return res.status(500).json({
          success: false,
          message: "Error fetching departments.",
        });
      }

      if (result.length > 0) {
        return res.json({
          success: true,
          departments: result,
        });
      } else {
        return res.json({
          success: false,
          message: "No departments found.",
        });
      }
    }
  );
};

// Fetch Budget Details for a specific department
const getBudgetReport = (req, res) => {
  const { departmentId } = req.params;

  // Call the stored procedure to get budget report
  db.query("CALL GetDepartmentBudgetReport()", (err, result) => {
    if (err) {
      console.error("Error fetching budget report:", err);
      return res.status(500).json({
        success: false,
        message: "Error fetching budget report.",
      });
    }

    if (result[0].length > 0) {
      const budgetReport = result[0].filter(
        (item) => item.department_id == departmentId
      );

      return res.json({
        success: true,
        report: budgetReport,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "No budget data found for the selected department.",
      });
    }
  });
};

const generateBudgetReportPDF = (req, res) => {
  const { departmentId } = req.params;

  // Create a new jsPDF instance
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

  // Call the stored procedure to get budget data
  db.query("CALL GetDepartmentBudgetReport()", (err, result) => {
    if (err) {
      console.error("Error fetching budget report for PDF:", err);
      return res.status(500).json({
        success: false,
        message: "Error generating the budget PDF report.",
      });
    }

    if (result[0].length > 0) {
      // Filter the result based on departmentId
      const budgetData = result[0].filter(
        (item) => item.department_id == departmentId
      );

      if (budgetData.length > 0) {
        // Add Title and Main Heading
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.setTextColor(0, 102, 204); // Blue color (RGB)
        doc.text("Department Budget Report", 105, 20, { align: "center" });

        // Add a Line Separator for visual style
        doc.setLineWidth(0.5);
        doc.line(20, 25, 190, 25); // Horizontal line
        doc.setLineWidth(1);

        // Add Department Budget Details Heading
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0); // Black color
        doc.text("Budget Details", 20, 40);

        let yPosition = 50; // Start position for the first item
        budgetData.forEach((item) => {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(12);
          doc.text(`Department: ${item.department_name}`, 20, yPosition);
          doc.text(
            `Allocated Amount: ${item.allocated_amount}`,
            20,
            yPosition + 10
          );
          doc.text(`Spent Amount: ${item.spent_amount}`, 20, yPosition + 20);
          doc.text(
            `Remaining Amount: ${item.remaining_amount}`,
            20,
            yPosition + 30
          );
          doc.text(`Year: ${item.year}`, 20, yPosition + 40);
          yPosition += 50; // Move to the next line for the next department
        });

        // Finalize PDF and send as response
        const pdfOutput = doc.output("arraybuffer");
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
          "Content-Disposition",
          "attachment; filename=Budget_Report.pdf"
        );
        res.send(Buffer.from(pdfOutput));
      } else {
        return res.status(404).json({
          success: false,
          message: "No budget data found for this department.",
        });
      }
    } else {
      return res.status(404).json({
        success: false,
        message: "No budget data found.",
      });
    }
  });
};

module.exports = {
  getDepartments,
  getBudgetReport,
  generateBudgetReportPDF,
};
