// Fetch vendors and contracts when the page loads
window.onload = function () {
  loadVendorDropdown("vendor");
  fetchContracts(); // Fetch contract names for dropdown
};

// Fetch contracts for the contract dropdown
function fetchContracts() {
  apiFetch("/api/hell/contracts") // API to fetch contract names (make sure this endpoint is set up)
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        const contractSelect = document.getElementById("contract_name");
        data.contracts.forEach((contract) => {
          const option = document.createElement("option");
          option.value = contract.contract_id;
          option.textContent = contract.contract_name;
          contractSelect.appendChild(option);
        });
      } else {
        showError("Failed to fetch contracts.");
      }
    })
    .catch((err) => showError("Error fetching contracts."));
}

// Fetch contract details when a contract is selected
function fetchContractDetails(contractId) {
  if (contractId === "") return;

  apiFetch(`/api/hell/contracts/${contractId}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        const contract = data.contract;

        // Extract the date part (yyyy-MM-dd) from the ISO string
        const formattedStartDate = contract.start_date.split("T")[0]; // Get "yyyy-MM-dd"
        const formattedEndDate = contract.end_date.split("T")[0]; // Get "yyyy-MM-dd"

        // Set contract details in form fields
        document.getElementById("contract_name_input").value =
          contract.contract_name;
        document.getElementById("contract_terms").value =
          contract.contract_terms;
        document.getElementById("start_date").value = formattedStartDate; // Use formatted date
        document.getElementById("end_date").value = formattedEndDate; // Use formatted date
        document.getElementById("contract_value").value =
          contract.contract_value;
        document.getElementById("payment_terms").value = contract.payment_terms;
        document.getElementById("vendor").value = contract.vendor_id;
      } else {
        showError("Failed to fetch contract details.");
      }
    })
    .catch((err) => showError("Error fetching contract details."));
}

// Submit contract update form
document
  .getElementById("contract-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const data = {
      contract_id: formData.get("contract_id"),
      vendor_id: formData.get("vendor_id"),
      contract_name: formData.get("contract_name"),
      contract_terms: formData.get("contract_terms"),
      start_date: formData.get("start_date"),
      end_date: formData.get("end_date"),
      contract_value: formData.get("contract_value"),
      payment_terms: formData.get("payment_terms"),
    };

    apiFetch("/api/hell/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          alert("Contract updated successfully!");
        } else {
          showError(result.message);
        }
      })
      .catch((err) => showError("Error updating contract."));
  });

// Function to show error messages
