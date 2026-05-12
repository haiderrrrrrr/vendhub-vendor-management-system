// Fetch departments when the page loads
window.onload = function () {
  fetchDepartments(); // Fetch department names for dropdown
};

// Fetch departments for the department dropdown
function fetchDepartments() {
  apiFetch("/api/departments") // API to fetch departments
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        const departmentSelect = document.getElementById("department_name");
        data.departments.forEach((department) => {
          const option = document.createElement("option");
          option.value = department.department_id; // department_id is the value
          option.textContent = department.department_name; // department_name is the display text
          departmentSelect.appendChild(option);
        });
      } else {
        showError("Failed to fetch departments.");
      }
    })
    .catch((err) => showError("Error fetching departments."));
}

// Fetch budget details when a department is selected
document
  .getElementById("department_name")
  .addEventListener("change", function () {
    const deptId = this.value;
    if (deptId === "") return; // Do nothing if no department is selected

    apiFetch(`/api/budget/${deptId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          const budget = data.budget;
          document.getElementById("allocated_amount").value =
            budget.allocated_amount;
          document.getElementById("spent_amount").value = budget.spent_amount;
          document.getElementById("year").value = budget.year;
        } else {
          showError("Failed to fetch budget details.");
        }
      })
      .catch((err) => showError("Error fetching budget details."));
  });

// Submit budget update form
document
  .getElementById("department-budget-form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission

    const formData = new FormData(this);

    // Get department_id from the dropdown directly
    const deptId = document.getElementById("department_name").value;

    const data = {
      department_id: deptId, // Correctly get department_id from the dropdown
      allocated_amount: formData.get("allocated_amount"),
      spent_amount: formData.get("spent_amount"),
      year: formData.get("year"),
    };

    console.log("Data being sent:", data); // Log data to check before sending

    apiFetch("/api/budget/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Sending as JSON
      },
      body: JSON.stringify(data), // Send the data as JSON
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          alert("Budget updated successfully!");
        } else {
          showError(result.message); // Show error from the backend
        }
      })
      .catch((err) => showError("Error updating budget.")); // Generic error if fetch fails
  });

// Function to show error messages
