// Attach an event listener to the form's submit button
document.querySelector("form").addEventListener("submit", async function (e) {
  e.preventDefault(); // Prevent the default form submission

  // Get form values
  const name = document.querySelector("input[name='txtName']").value;
  const email = document.querySelector("input[name='txtEmail']").value;
  const phone = document.querySelector("input[name='txtPhone']").value;
  const message = document.querySelector("textarea[name='txtMsg']").value;

  // Prepare the data to be sent to the server
  const data = {
    name,
    email,
    phone,
    message,
  };

  try {
    // Send the data to the server via a POST request
    const response = await apiFetch("/send-contact-form", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (response.ok) {
      // If the response is successful, show a success message
      alert("Your message has been sent successfully!");
    } else {
      // If there is an error, show an error message
      alert("Error: " + result.error);
    }
  } catch (error) {
    console.error("Error submitting the form: ", error);
    alert("An error occurred. Please try again later.");
  }
});
