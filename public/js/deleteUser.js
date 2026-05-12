document.addEventListener("DOMContentLoaded", async function () {
  const userSelect = document.getElementById("user-select");

  // Fetch users and populate the user select dropdown
  try {
    const userResponse = await apiFetch("/api/users");
    const users = await userResponse.json();

    if (!Array.isArray(users)) {
      throw new Error("Expected an array of users from the server.");
    }

    users.forEach((user) => {
      const option = document.createElement("option");
      option.value = user.user_id;
      option.textContent = user.username;
      userSelect.appendChild(option);
    });
  } catch (error) {
    showError("Failed to fetch users. Please try again later.");
    console.error("Error fetching users:", error);
  }

  // When a user is selected, populate the form with their details
  userSelect.addEventListener("change", async function () {
    const userId = userSelect.value;

    if (userId) {
      try {
        const userResponse = await apiFetch(`/api/users/${userId}`);
        const user = await userResponse.json();

        // Check if user data is valid before updating the form
        if (user && user.username) {
          document.getElementById("username").value = user.username;
          document.getElementById("email").value = user.email;
        } else {
          showError("Failed to fetch user details.");
        }
      } catch (error) {
        showError("Failed to fetch user details. Please try again.");
        console.error("Error fetching user details:", error);
      }
    }
  });

  // Form submission handler for deleting a user
  const deleteForm = document.getElementById("delete-user-form");
  deleteForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const userId = userSelect.value;

    if (!userId) {
      showError("Please select a user to delete.");
      return;
    }

    try {
      const result = await apiFetch(`/api/users/${userId}`, {
        method: "DELETE",
      });

      const data = await result.json();

      if (data.success) {
        alert("User deleted successfully!");
        // Optionally reset the form or the user list
        deleteForm.reset();
        userSelect.innerHTML = "<option value=''>Select User</option>"; // Reset user dropdown
        // Re-fetch users to update the list
        location.reload();
      } else {
        showError(`Error: ${data.message}`);
      }
    } catch (error) {
      showError("An error occurred while deleting the user. Please try again.");
      console.error("Error:", error);
    }
  });
});

