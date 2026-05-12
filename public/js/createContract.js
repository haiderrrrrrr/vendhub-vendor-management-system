// Function to show error messages

// Submit contract form
document
  .getElementById("contract-form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission

    // Get form data
    const formData = new FormData(this);
    const data = {
      vendor_id: formData.get("vendor_id"),
      contract_name: formData.get("contract_name"),
      contract_terms: formData.get("contract_terms"),
      start_date: formData.get("start_date"),
      end_date: formData.get("end_date"),
      contract_value: parseFloat(formData.get("contract_value")),
      payment_terms: formData.get("payment_terms"),
    };

    // Validate form data
    if (
      !data.vendor_id ||
      !data.contract_name ||
      !data.contract_terms ||
      !data.start_date ||
      !data.end_date ||
      !data.contract_value ||
      !data.payment_terms
    ) {
      showError("All fields are required.");
      return;
    }

    if (data.contract_value <= 0) {
      showError("Contract value must be greater than 0.");
      return;
    }

    // Send the data to the server
    apiFetch("/api/contracts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          alert("Contract created successfully.");
          // Reset form or redirect, if necessary
        } else {
          showError(result.message || "Failed to create contract.");
        }
      })
      .catch((err) => showError("Error creating contract: " + err.message));
  });

// Fetch vendors when the page loads
document.addEventListener("DOMContentLoaded", function () {
  loadVendorDropdown("vendor");
});
