document.addEventListener("DOMContentLoaded", async function () {
  const vendorSelect = document.getElementById("vendor-select");
  const checkButton = document.getElementById("check-compliance-btn");
  const messageDiv = document.getElementById("message");
  const messageText = document.getElementById("message-text");
  const certificationsDiv = document.getElementById("certifications");
  const certificationList = document.getElementById("certification-list");

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

  // Handle Check Compliance action
  checkButton.addEventListener("click", async function () {
    const vendorId = vendorSelect.value;

    if (!vendorId) {
      showError("Please select a vendor to check compliance.");
      return;
    }

    try {
      const response = await apiFetch(`/api/check-compliance/${vendorId}`);
      const data = await response.json();

      if (data.success) {
        showMessage(data.message, "success");

        // Display the certifications
        certificationsDiv.style.display = "block";
        certificationList.innerHTML = ""; // Clear existing list
        data.certifications.forEach((cert) => {
          const li = document.createElement("li");
          li.textContent = `${cert.certification_name} issued by ${cert.issued_by} on ${cert.issue_date}`;
          certificationList.appendChild(li);
        });
      } else {
        showError(data.message);
        certificationsDiv.style.display = "none"; // Hide certifications list if no compliance
      }
    } catch (error) {
      showError("Error checking compliance. Please try again.");
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
