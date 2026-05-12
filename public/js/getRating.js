// Fetch vendors when the page loads
window.onload = function () {
  loadVendorDropdown("vendor-select");
};

// Function to handle the 'Get Performance' button click
document
  .getElementById("get-performance-btn")
  .addEventListener("click", function () {
    const vendorId = document.getElementById("vendor-select").value;
    if (vendorId) {
      fetchPerformance(vendorId);
    } else {
      showError("Please select a vendor.");
    }
  });

// Fetch Performance Data for the selected vendor
function fetchPerformance(vendorId) {
  apiFetch(`/api/performance/${vendorId}`) // API to fetch performance evaluation for the selected vendor
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        const performanceDetails = data.performance;
        // Update the DOM with the fetched data
        document.getElementById("vendor-name").textContent =
          performanceDetails.vendor_name;
        document.getElementById("performance-rating").textContent =
          performanceDetails.rating;
        document.getElementById("feedback-text").textContent =
          performanceDetails.feedback;
        document.getElementById("improvement-notes").textContent =
          performanceDetails.improvement_notes;
        document.getElementById("evaluation-date").textContent =
          performanceDetails.evaluation_date;
        document.getElementById("evaluator-name").textContent =
          performanceDetails.evaluator_name;

        // Show the performance details container
        document.getElementById(
          "performance-evaluation-details"
        ).style.display = "block";
      } else {
        showError("Failed to fetch performance evaluation.");
      }
    })
    .catch((err) => showError("Error fetching performance."));
}

// Generate the report as a PDF when the "Generate Report" button is clicked
document
  .getElementById("generate-report-btn")
  .addEventListener("click", function () {
    const vendorId = document.getElementById("vendor-select").value;
    if (vendorId) {
      generatePerformanceReport(vendorId);
    } else {
      showError("Please select a vendor before generating the report.");
    }
  });

// Function to generate the performance report PDF
function generatePerformanceReport(vendorId) {
  apiFetch(`/api/generate-performance-report/${vendorId}`) // API to generate PDF report for the selected vendor's performance
    .then((response) => response.blob())
    .then((blob) => {
      // Create a link to download the PDF
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `Performance_Report_${vendorId}.pdf`;
      link.click();
    })
    .catch((err) => showError("Error generating the performance report."));
}

