const axios = require("axios"); // For make HTTP requests

// Admin user details
const adminData = {
  name: "Admin",
  email: "admin@gmail.com",
  password: "Admin123!",
  role_name: "Admin",
};

// Calling the API directly to register the admin
async function createAdminUser() {
  console.log("Starting the admin creation process...");

  try {
    console.log("Sending request to create admin user with data:", adminData);

    const response = await axios.post(
      "http://localhost:3000/api/signup",
      adminData
    );

    console.log("Response received from server:", response);

    if (response.status === 201) {
      console.log("Admin user created successfully:", response.data);
    } else {
      console.log(
        "Failed to create admin user, server responded with:",
        response.data
      );
    }
  } catch (error) {
    console.error("Error creating admin user:", error.message);
    console.error(
      "Error details:",
      error.response ? error.response.data : error
    );
    console.error(
      "Error status:",
      error.response ? error.response.status : "N/A"
    );
    console.error("Stack trace:", error.stack);
  }
}

// Executing the function
console.log("Executing the createAdminUser function...");
createAdminUser();
