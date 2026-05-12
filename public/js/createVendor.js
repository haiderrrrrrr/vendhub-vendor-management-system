// Show error message

// JavaScript for adding/removing certifications
const addCertificationButton = document.getElementById("add-certification");
const certificationsContainer = document.getElementById("certifications");

addCertificationButton.addEventListener("click", () => {
  const newCertification = document.createElement("div");
  newCertification.classList.add("certification-entry");
  newCertification.innerHTML = `
    <input type="text" class="certification_name" placeholder="Certification Name" required />
    <input type="text" class="issued_by" placeholder="Issued By" required />
    <input type="date" class="issue_date" placeholder="Issue Date" required />
    <button type="button" class="remove-cert">Remove</button>
  `;
  certificationsContainer.appendChild(newCertification);

  // Add event listener to remove the certification
  newCertification
    .querySelector(".remove-cert")
    .addEventListener("click", () => {
      newCertification.remove();
    });
});

// Vendor form submission handler
document
  .getElementById("vendor-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault(); // Prevent default form submission

    // Gather form data
    const formData = {
      username: document.getElementById("username").value,
      password: document.getElementById("password").value,
      email: document.getElementById("email").value,
      company_name: document.getElementById("company_name").value,
      service_category: document.getElementById("service_category").value,
      contact_name: document.getElementById("contact_name").value,
      contact_type: document.getElementById("contact_type").value,
      phone_number: document.getElementById("phone_number").value,
      contact_email: document.getElementById("contact_email").value,
      address: document.getElementById("address").value,
      certifications: [],
    };

    // Get all certifications
    const certificationEntries = document.querySelectorAll(
      ".certification-entry"
    );
    certificationEntries.forEach((entry) => {
      const certification = {
        certification_name: entry.querySelector(".certification_name").value,
        issued_by: entry.querySelector(".issued_by").value,
        issue_date: entry.querySelector(".issue_date").value,
      };
      formData.certifications.push(certification);
    });

    // Debugging: Log the form data for review
    console.log("Form Data Sent:", formData);

    try {
      // Send the POST request to the server
      const response = await apiFetch("/api/vendor/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Debugging: Check the response status and data
      console.log("Response Status:", response.status);
      const result = await response.json();
      console.log("Response Data:", result);

      // Check if the response is OK (status code 200)
      if (response.ok) {
        alert("Vendor registered successfully");
        document.getElementById("vendor-form").reset(); // Reset form after success
      } else {
        // Handle errors (e.g., validation or server-side issues)
        showError(result.error || "Unknown error"); // Call showError to display error
      }
    } catch (error) {
      // Handle network or unexpected server errors
      console.error("Error during the fetch request:", error);
      showError("Server error. Please try again later."); // Call showError for server errors
    }
  });
