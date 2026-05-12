// Show success message
function showSuccess(message) {
  alert("Success: " + message);
}

// Event listener for button click to track budget alerts
document
  .getElementById("track-budget-alerts-btn")
  .addEventListener("click", function () {
    apiFetch("/api/check-budget-alerts") // Assuming your route is '/api/check-budget-alerts'
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data from the server");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched Budget Alerts:", data); // Check the data being returned from the API

        const container = document.getElementById("purchase-orders-container");
        container.innerHTML = ""; // Clear previous results

        // If no data is returned, show a message
        if (data.length === 0) {
          showError("No purchase orders exceed the budget.");
          return;
        }

        // Loop through the purchase orders and display them
        data.forEach((po) => {
          const poElement = document.createElement("div");
          poElement.classList.add("purchase-order");

          poElement.innerHTML = `
              <h3>Purchase Order #${po.po_id}</h3>
              <p>Department ID: ${po.department_id}</p>
              <p>Vendor ID: ${po.vendor_id}</p>
              <p>PO Date: ${po.po_date}</p>
              <p>Total Cost: £${po.total_cost}</p>
              <p>Approval Status: ${po.approval_status}</p>
              <p>Budget Compliance: ${
                po.budget_compliance ? "Compliant" : "Non-Compliant"
              }</p>
              <p>Remaining Budget: £${po.department_remaining_budget}</p>
              <hr>
            `;
          container.appendChild(poElement);
        });

        showSuccess("Fetched Successfully"); // Show success message after displaying data
      })
      .catch((error) => {
        console.error("Error:", error);
        showError("Failed to fetch budget alerts.");
      });
  });
