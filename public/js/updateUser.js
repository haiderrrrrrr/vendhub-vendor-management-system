document.addEventListener("DOMContentLoaded", async function () {
  const userSelect = document.getElementById("user-select");
  const roleSelect = document.getElementById("role");

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

  // Fetch roles and populate the role select dropdown
  try {
    const roleResponse = await apiFetch("/api/roles");
    const roles = await roleResponse.json();

    if (!Array.isArray(roles)) {
      throw new Error("Expected an array of roles from the server.");
    }

    roles.forEach((role) => {
      const option = document.createElement("option");
      option.value = role.role_id;
      option.textContent = role.role_name;
      roleSelect.appendChild(option);
    });
  } catch (error) {
    showError("Failed to fetch roles. Please try again later.");
    console.error("Error fetching roles:", error);
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
          document.getElementById("role").value = user.role_id;
        } else {
          showError("Failed to fetch user details.");
        }
      } catch (error) {
        showError("Failed to fetch user details. Please try again.");
        console.error("Error fetching user details:", error);
      }
    }
  });

  // Form submission handler
  const userForm = document.getElementById("update-user-form");
  userForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const email = document.getElementById("email").value;
    const role_id = document.getElementById("role").value;
    const user_id = userSelect.value;

    if (!username || !password || !email || !role_id || !user_id) {
      showError("Please fill in all fields.");
      return;
    }

    const updatedUser = { username, password, email, role_id };

    try {
      const result = await apiFetch(`/api/users/${user_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });

      const data = await result.json();

      if (data.success) {
        alert("User updated successfully!");
        // Optionally reset the form
        userForm.reset();
      } else {
        showError(`Error: ${data.message}`);
      }
    } catch (error) {
      showError("An error occurred while updating the user. Please try again.");
      console.error("Error:", error);
    }
  });
});

