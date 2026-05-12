// Fetch vendors when the page loads
window.onload = function () {
  loadVendorDropdown("vendor-select");
};

// Function to handle the 'Get Vendor Details' button click
document
  .getElementById("get-vendor-details-btn")
  .addEventListener("click", function () {
    const vendorId = document.getElementById("vendor-select").value;
    if (vendorId) {
      fetchVendorDetails(vendorId);
    } else {
      showError("Please select a vendor.");
    }
  });

// Fetch Vendor Details for the selected vendor
function fetchVendorDetails(vendorId) {
  apiFetch(`/api/vendor/${vendorId}`) // API to fetch vendor details
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        const vendorDetails = data.vendor;

        // Update the DOM with the fetched data
        document.getElementById("vendor-id").textContent =
          vendorDetails.vendor_id;
        document.getElementById("company-name").textContent =
          vendorDetails.company_name;
        document.getElementById("service-category").textContent =
          vendorDetails.service_category;
        document.getElementById("registration-date").textContent =
          vendorDetails.registration_date;
        document.getElementById("contact-name").textContent =
          vendorDetails.contact_name;
        document.getElementById("phone-number").textContent =
          vendorDetails.phone_number;
        document.getElementById("contact-email").textContent =
          vendorDetails.contact_email;
        document.getElementById("contact-address").textContent =
          vendorDetails.contact_address;
        document.getElementById("contact-type").textContent =
          vendorDetails.contact_type;

        // Populate the compliance certifications table
        const certificationsTableBody = document.querySelector(
          "#certifications-table tbody"
        );
        certificationsTableBody.innerHTML = ""; // Clear previous rows

        // Check if certifications exist and dynamically create rows
        if (
          vendorDetails.certification_name ||
          vendorDetails.issued_by ||
          vendorDetails.issue_date
        ) {
          const row = document.createElement("tr");

          const certNameCell = document.createElement("td");
          certNameCell.textContent = vendorDetails.certification_name || "N/A"; // Default to "N/A" if empty
          row.appendChild(certNameCell);

          const issuedByCell = document.createElement("td");
          issuedByCell.textContent = vendorDetails.issued_by || "N/A"; // Default to "N/A" if empty
          row.appendChild(issuedByCell);

          const issueDateCell = document.createElement("td");
          if (vendorDetails.issue_date) {
            issueDateCell.textContent = new Date(
              vendorDetails.issue_date
            ).toLocaleDateString(); // Format date
          } else {
            issueDateCell.textContent = "N/A"; // Default to "N/A" if empty
          }
          row.appendChild(issueDateCell);

          certificationsTableBody.appendChild(row);
        } else {
          // If no certifications are available, display a message
          const noCertRow = document.createElement("tr");
          const noCertCell = document.createElement("td");
          noCertCell.setAttribute("colspan", "3");
          noCertCell.textContent = "No certifications available.";
          noCertRow.appendChild(noCertCell);
          certificationsTableBody.appendChild(noCertRow);
        }

        // Show the vendor details section
        document.getElementById("vendor-details").style.display = "block";
      } else {
        showError("Failed to fetch vendor details.");
      }
    })
    .catch((err) => showError("Error fetching vendor details."));
}

// Generate the vendor report as a PDF when the "Generate Report" button is clicked
document
  .getElementById("generate-report-btn")
  .addEventListener("click", function () {
    const vendorId = document.getElementById("vendor-select").value;
    if (vendorId) {
      generateVendorReport(vendorId);
    } else {
      showError("Please select a vendor before generating the report.");
    }
  });

// Function to generate the vendor report PDF
function generateVendorReport(vendorId) {
  apiFetch(`/api/generate-vendor-report/${vendorId}`) // API to generate PDF report for the selected vendor
    .then((response) => response.blob())
    .then((blob) => {
      // Create a link to download the PDF
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `Vendor_Report_${vendorId}.pdf`;
      link.click();
    })
    .catch((err) => showError("Error generating the vendor report."));
}

