const { jsPDF } = require("jspdf");
const fs = require("fs");
const path = require("path");
const db = require("../config/db");
require("jspdf-autotable");

const getUsers = (req, res) => {
  db.query("SELECT * FROM User", (err, users) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Error fetching users from the database.",
      });
    }

    // Create an array of promises to fetch roles
    const rolePromises = users.map((user) => {
      return new Promise((resolve, reject) => {
        db.query(
          "SELECT role_name FROM Role WHERE role_id = ?",
          [user.role_id],
          (err, roleResults) => {
            if (err) {
              return reject(err); // Reject the promise on error
            }
            if (roleResults.length > 0) {
              user.role_name = roleResults[0].role_name;
            } else {
              user.role_name = null; // If no role found, set role_name to null
            }
            resolve(user); // Resolve with the updated user object
          }
        );
      });
    });

    // Wait for all role fetches to complete
    Promise.all(rolePromises)
      .then((updatedUsers) => {
        res.status(200).json(updatedUsers); // Send the updated user data with roles
      })
      .catch((error) => {
        res.status(500).json({
          success: false,
          message: "Error fetching roles for users.",
        });
        console.error("Error fetching roles:", error);
      });
  });
};

const generateReport = (req, res) => {
  try {
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

    // Add title with elegant color and centered text
    doc.setFont("helvetica", "bold");
    doc.setFontSize(26);
    doc.setTextColor(0, 102, 204); // Blue color (RGB)
    doc.text("Venhub System User's Report", 105, 40, { align: "center" });

    // Add static introductory line with a softer gray color
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.setTextColor(50, 50, 50); // Dark Gray color (RGB)
    doc.text("Here is the requested information for your reference:", 10, 55);

    // Fetch the user details from the database
    db.query("SELECT * FROM User", (err, users) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Error fetching users from the database.",
        });
      }

      // Prepare the table data
      const tableData = users.map((user) => [
        user.username || "N/A",
        user.email || "N/A",
        user.role_name || "N/A",
      ]);

      // Define table columns (headers)
      const columns = ["Username", "Email", "Role"];

      // Add the table to the PDF with enhanced design
      doc.autoTable(columns, tableData, {
        startY: 65, // Start the table below the intro text
        margin: { top: 10 },
        theme: "grid",
        headStyles: {
          fillColor: [0, 102, 204], // Blue color for the header row
          textColor: [255, 255, 255], // White text for the header
          fontSize: 12,
          halign: "center",
          fontStyle: "bold", // Make the header text bold
          lineWidth: 0.5,
          lineColor: [255, 255, 255], // Subtle white lines
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
          // Additional content can go here, such as page numbers or section titles
        },
      });

      // Add footer with a soft red color and developer's name
      doc.setFont("helvetica", "italic");
      doc.setFontSize(12);
      doc.setTextColor(255, 87, 34); // Soft Red color (RGB)
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
      res.setHeader("Content-Disposition", "attachment; filename=report.pdf");

      res.end(Buffer.from(pdfBuffer));
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return res.status(500).json({
      success: false,
      message: "Error generating the report.",
    });
  }
};

module.exports = { generateReport, getUsers };
