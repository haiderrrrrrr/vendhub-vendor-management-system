document.addEventListener("DOMContentLoaded", function () {
  const fetchUsersBtn = document.getElementById("fetch-users-btn");
  const usersTable = document.getElementById("users-table");
  const usersTableBody = usersTable.querySelector("tbody");

  // Function to fetch users from the server
  const fetchUsers = async () => {
    try {
      const response = await apiFetch("/api/users");

      if (!response.ok) {
        throw new Error("Failed to fetch users from the server.");
      }

      const users = await response.json();

      if (users.length > 0) {
        // Clear previous table rows
        usersTableBody.innerHTML = "";

        // Add each user to the table
        users.forEach((user) => {
          const row = document.createElement("tr");
          row.innerHTML = `
                          <td>${user.username}</td>
                          <td>${user.email}</td>
                          <td>${user.role_name || "N/A"}</td>
                      `;
          usersTableBody.appendChild(row);
        });

        // Show the table
        usersTable.style.display = "table";
      } else {
        showError("No users found.");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      showError("Failed to fetch users.");
    }
  };

  // Event listener for the "Fetch All Users" button
  fetchUsersBtn.addEventListener("click", fetchUsers);

  // Generate report when button is clicked
  document
    .getElementById("generate-report-btn")
    .addEventListener("click", function () {
      // Trigger the API call to generate the report
      apiFetch("/api/generate-report")
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
          link.download = "report.pdf";
          link.click(); // Trigger the download
        })
        .catch((error) => {
          console.error(error);
          showError("There was an error generating the report.");
        });
    });
});

// Function to show error messages
