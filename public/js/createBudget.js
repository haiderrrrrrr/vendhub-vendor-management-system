// Show error message

// Form submission handler
document
  .getElementById("department-budget-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const department_name = document.getElementById("department_name").value;
    const allocated_amount = parseFloat(
      document.getElementById("allocated_amount").value
    );
    const spent_amount = parseFloat(
      document.getElementById("spent_amount").value
    );
    const year = parseInt(document.getElementById("year").value, 10);

    // Validate input fields before making API request
    if (
      !department_name ||
      isNaN(allocated_amount) ||
      isNaN(spent_amount) ||
      isNaN(year)
    ) {
      showError("Please fill in all fields with valid values.");
      return;
    }

    // Send data to the API endpoint
    apiFetch("/api/budget/create-budget", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        department_name,
        allocated_amount,
        spent_amount,
        year,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          showError(data.error); // Show error if there is an error message from the API
        } else {
          alert(data.message); // Show success message
        }
      })
      .catch((error) => {
        showError("Error creating budget and department: " + error.message);
        console.error(error);
      });
  });
