document.addEventListener("DOMContentLoaded", async function () {
  const roleSelect = document.getElementById("role");

  // Fetch roles from the server and populate the role selection
  const response = await apiFetch("/api/roles");
  const roles = await response.json();

  roles.forEach((role) => {
    const option = document.createElement("option");
    option.value = role.role_id;
    option.textContent = role.role_name;
    roleSelect.appendChild(option);
  });

  // Form submission handler
  const userForm = document.getElementById("user-form");
  userForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const email = document.getElementById("email").value;
    const role_id = document.getElementById("role").value;

    // Validate inputs
    if (!username || !password || !email || !role_id) {
      showError("Please fill in all fields.");
      return;
    }

    const newUser = { username, password, email, role_id };

    const submitButton = document.querySelector("button[type='submit']");
    submitButton.disabled = true;

    try {
      const result = await apiFetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      const data = await result.json();

      if (data.success) {
        alert("User created successfully!");
        userForm.reset(); // Reset form after success
      } else {
        showError(`Error: ${data.message}`);
      }
    } catch (error) {
      showError("An error occurred while creating the user. Please try again.");
      console.error("Error:", error);
    } finally {
      submitButton.disabled = false;
    }
  });
});
