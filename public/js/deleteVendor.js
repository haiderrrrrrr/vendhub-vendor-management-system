document.addEventListener("DOMContentLoaded", async function () {
  console.log("JavaScript loaded!"); // This will confirm that the script is loaded.

  const vendorSelect = document.getElementById("vendor-select");
  const deleteButton = document.getElementById("delete-vendor-btn");
  const messageDiv = document.getElementById("message");
  const messageText = document.getElementById("message-text");

  // Fetch vendors and populate the vendor select dropdown
  try {
    const response = await apiFetch("/api/vendors");
    const data = await response.json();
    console.log("Vendors fetched:", data); // Log vendors to check if they are fetched correctly

    // Check if the data contains the 'vendors' key
    if (data.success && Array.isArray(data.vendors)) {
      data.vendors.forEach((vendor) => {
        const option = document.createElement("option");
        option.value = vendor.vendor_id;
        option.textContent = vendor.company_name;
        vendorSelect.appendChild(option);
      });
    } else {
      showError("Failed to fetch vendors.");
    }
  } catch (error) {
    showError("Error fetching vendors. Please try again.");
    console.error("Error:", error);
  }

  // Handle delete vendor action
  deleteButton.addEventListener("click", async function () {
    const vendorId = vendorSelect.value;

    if (!vendorId) {
      showError("Please select a vendor to delete.");
      return;
    }

    try {
      const response = await apiFetch(`/api/vendors/${vendorId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        showMessage(data.message, "success");
        setTimeout(() => {
          location.reload(); // Refresh the page after successful deletion
        }, 2000);
      } else {
        showError(data.message);
      }
    } catch (error) {
      showError("Error deleting vendor. Please try again.");
      console.error("Error:", error);
    }
  });

  // Function to show error messages
  function showError(message) {
    messageDiv.style.display = "block";
    messageDiv.classList.remove("success");
    messageDiv.classList.add("error");
    messageText.textContent = message;
  }

  // Function to show success messages
  function showMessage(message, type) {
    messageDiv.style.display = "block";
    messageDiv.classList.remove("error");
    messageDiv.classList.add(type === "success" ? "success" : "error");
    messageText.textContent = message;
  }
});
