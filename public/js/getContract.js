document.addEventListener("DOMContentLoaded", function () {
  const getContractsBtn = document.getElementById("get-contract-details-btn");
  const contractDropdown = document.getElementById("contract-dropdown");
  const contractDetailsSection = document.getElementById("contract-details");
  const generateReportBtn = document.getElementById("generate-report-btn");

  // Function to fetch contracts from the server and populate the dropdown
  const fetchContracts = async () => {
    try {
      const response = await apiFetch("/api/contracts");

      if (!response.ok) {
        throw new Error("Failed to fetch contracts from the server.");
      }

      const contracts = await response.json();

      if (contracts.length > 0) {
        // Clear previous options and populate new options
        contractDropdown.innerHTML =
          '<option value="">--Select a Contract--</option>';
        contracts.forEach((contract) => {
          const option = document.createElement("option");
          option.value = contract.contract_id;
          option.textContent = contract.contract_name;
          contractDropdown.appendChild(option);
        });
      } else {
        showError("No contracts found.");
      }
    } catch (error) {
      console.error("Error fetching contracts:", error);
      showError("Failed to fetch contracts.");
    }
  };

  // Function to fetch contract details when a contract is selected
  const fetchContractDetails = async (contractId) => {
    try {
      const response = await apiFetch(`/api/contracts/${contractId}`);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error fetching contract details:", errorData.message);
        throw new Error("Failed to fetch contract details.");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "No contract details available.");
      }

      const contract = data.contract; // Extract the contract data from the response

      // Display contract details
      document.getElementById("contract-name").textContent =
        contract.contract_name || "N/A";
      document.getElementById("contract-terms").textContent =
        contract.contract_terms || "N/A";
      document.getElementById("contract-start-date").textContent =
        contract.start_date || "N/A";
      document.getElementById("contract-end-date").textContent =
        contract.end_date || "N/A";
      document.getElementById("contract-status").textContent =
        contract.contract_status || "N/A";
      document.getElementById("contract-value").textContent =
        contract.contract_value || "N/A";
      document.getElementById("contract-payment-terms").textContent =
        contract.payment_terms || "N/A";
      document.getElementById("contract-amendments").textContent =
        contract.amendments || "N/A";

      // Vendor Details
      document.getElementById("vendor-name").textContent =
        contract.vendor_name || "N/A";
      document.getElementById("vendor-service-category").textContent =
        contract.service_category || "N/A";
      document.getElementById("vendor-registration-date").textContent =
        contract.registration_date || "N/A";

      // Vendor Contact Info
      document.getElementById("vendor-contact-name").textContent =
        contract.vendor_contact_name || "N/A";
      document.getElementById("vendor-phone-number").textContent =
        contract.vendor_phone_number || "N/A";
      document.getElementById("vendor-email").textContent =
        contract.vendor_email || "N/A";
      document.getElementById("vendor-address").textContent =
        contract.vendor_address || "N/A";

      // Vendor Certifications
      document.getElementById("vendor-certification-name").textContent =
        contract.certification_name || "N/A";
      document.getElementById("vendor-issued-by").textContent =
        contract.issued_by || "N/A";
      document.getElementById("vendor-certification-date").textContent =
        contract.certification_issue_date || "N/A";

      contractDetailsSection.style.display = "block"; // Show the contract details section
    } catch (error) {
      console.error("Error fetching contract details:", error);
      showError("Successfully fetched contract details.");
    }
  };

  // Event listener for "Get Contract Details" button
  getContractsBtn.addEventListener("click", function () {
    const selectedContractId = contractDropdown.value;
    if (selectedContractId) {
      fetchContractDetails(selectedContractId);
    } else {
      showError("Please select a contract.");
    }
  });

  // Event listener for "Generate Report" button
  generateReportBtn.addEventListener("click", function () {
    // Trigger the API call to generate the report
    apiFetch("/api/generate-report-contracts")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error generating report");
        }
        return response.blob(); // Get the PDF as a Blob
      })
      .then((blob) => {
        // Create a link element to trigger the download
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "contracts-report.pdf";
        link.click(); // Trigger the download
      })
      .catch((error) => {
        console.error(error);
        showError("There was an error generating the report.");
      });
  });

  // Function to show error messages
  
  // Call fetchContracts on page load
  fetchContracts();
});
