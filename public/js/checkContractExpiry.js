// Frontend JS

// Function to display contracts expiring in the next 30 days
function displayExpiringContracts() {
  const alertDiv = document.getElementById("expiry-alerts");
  const container = document.getElementById("contracts-container");
  container.innerHTML = ""; // Clear previous content

  // Fetch expiring contracts from the server
  apiFetch("/api/expiring-contracts")
    .then((response) => response.json())
    .then((data) => {
      if (data.success && data.contracts.length > 0) {
        // If there are expiring contracts, display them in contract boxes
        data.contracts.forEach((contract) => {
          const contractBox = document.createElement("div");
          contractBox.classList.add("contract-box");
          contractBox.innerHTML = `
              <h3>${contract.contract_name}</h3>
              <p><span>Vendor:</span> ${contract.vendor}</p>
              <p><span>Value:</span> $${contract.contract_value}</p>
              <p><span>Expiry Date:</span> ${contract.end_date}</p>
              <p><span>Payment Terms:</span> ${contract.payment_terms}</p>
            `;
          container.appendChild(contractBox);
        });

        alertDiv.style.display = "block"; // Show expiry alerts
      } else {
        alertDiv.style.display = "none"; // Hide alert if no contracts are expiring soon
      }
    })
    .catch((error) => {
      console.error("Error fetching expiring contracts:", error);
    });
}

// Event listener for "Track Expiring Contracts" button
document
  .getElementById("track-contracts-btn")
  .addEventListener("click", function () {
    displayExpiringContracts();
  });
