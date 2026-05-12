// Fetch departments when the page loads
window.onload = function () {
  fetchDepartments();
};

// Fetch departments for the department dropdown
function fetchDepartments() {
  apiFetch("/api/departments") // API to fetch departments
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        const departmentSelect = document.getElementById("department-select");
        data.departments.forEach((department) => {
          const option = document.createElement("option");
          option.value = department.department_id;
          option.textContent = department.department_name;
          departmentSelect.appendChild(option);
        });
      } else {
        showError("Failed to fetch departments.");
      }
    })
    .catch((err) => showError("Error fetching departments."));
}

// Function to handle the 'Get Budget Report' button click
document
  .getElementById("get-budget-report-btn")
  .addEventListener("click", function () {
    const departmentId = document.getElementById("department-select").value;
    if (departmentId) {
      fetchBudgetReport(departmentId);
    } else {
      showError("Please select a department.");
    }
  });

// Fetch Budget Data for the selected department
function fetchBudgetReport(departmentId) {
  apiFetch(`/api/budget-report/${departmentId}`) // API to fetch budget report for the selected department
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        const reportDetails = data.report[0]; // Assuming there's one report per department

        // Update the DOM with the fetched data
        document.getElementById("department-name").textContent =
          reportDetails.department_name;
        document.getElementById("allocated-amount").textContent =
          reportDetails.allocated_amount;
        document.getElementById("spent-amount").textContent =
          reportDetails.spent_amount;
        document.getElementById("remaining-amount").textContent =
          reportDetails.remaining_amount;
        document.getElementById("year").textContent = reportDetails.year;

        // Show the budget details container
        document.getElementById("department-budget-details").style.display =
          "block";
      } else {
        showError("Failed to fetch budget report.");
      }
    })
    .catch((err) => showError("Error fetching budget report."));
}

// Generate the report as a PDF when the "Generate PDF Report" button is clicked
document
  .getElementById("generate-report-btn")
  .addEventListener("click", function () {
    const departmentId = document.getElementById("department-select").value;
    if (departmentId) {
      generateBudgetReportPDF(departmentId);
    } else {
      showError("Please select a department before generating the report.");
    }
  });

// Function to generate the budget report PDF
function generateBudgetReportPDF(departmentId) {
  apiFetch(`/api/generate-budget-report/${departmentId}`) // API to generate PDF report for the selected department
    .then((response) => response.blob())
    .then((blob) => {
      // Create a link to download the PDF
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `Budget_Report_${departmentId}.pdf`;
      link.click();
    })
    .catch((err) => showError("Error generating the budget report PDF."));
}

