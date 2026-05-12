// Handle form submission for sign-up
document
  .getElementById("signup-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent the default form submission

    const name = document.querySelector('input[name="name"]').value;
    const email = document.querySelector('input[name="email"]').value;
    const password = document.querySelector('input[name="password"]').value;
    const role_name = document.querySelector('select[name="role_name"]').value;

    const signUpData = { name, email, password, role_name };

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signUpData),
      });

      const result = await response.json();

      if (response.status === 201) {
        alert("Registration successful! Please log in.");
      } else {
        showError(result.message); // Display error message dynamically
      }
    } catch (error) {
      console.error("Registration failed:", error);
      showError("Registration failed. Please try again."); // Display a generic error message
    }
  });

// Login Form
// Login Form
document
  .getElementById("login-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent the default form submission

    const formData = new FormData(document.getElementById("login-form"));

    const formObject = {};
    formData.forEach((value, key) => {
      formObject[key] = value;
    });

    const email = formObject.email || "";
    const password = formObject.password || "";

    if (!email.trim() || !password.trim()) {
      showError("Please fill out both fields.");
      return;
    }

    const loginData = { email, password };

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const result = await response.json();

      if (response.status === 200) {
        alert("Login successful!");
        localStorage.setItem("jwtToken", result.token);
        localStorage.setItem("userRole", result.role);

        // Redirect based on role
        if (result.role === "Admin") {
          window.location.href = "/adminDashboard"; // Redirect to admin dashboard
        } else if (result.role === "Vendor") {
          window.location.href = "/vendorDashboard";
        } else if (result.role === "Budget Manager") {
          window.location.href = "/budgetManagerDashboard";
        } else if (result.role === "Finance Team") {
          window.location.href = "/financeTeamDashboard";
        } else if (result.role === "Department Heads") {
          window.location.href = "/departmentHeadDashboard";
        } else if (result.role === "Procurement Team") {
          window.location.href = "/procurementTeamDashboard";
        } else if (result.role === "Vendor Management Team") {
          window.location.href = "/vendorManagementTeamDashboard";
        } else if (result.role === "Procurement Manager") {
          window.location.href = "/procurementManagerDashboard";
        } else if (result.role === "Contract Management Team") {
          window.location.href = "/contractManagementTeamDashboard";
        }
      } else {
        showError(result.message); // Show error dynamically
      }
    } catch (error) {
      console.error("Error during login:", error);
      showError("Login failed. Please try again.");
    }
  });
