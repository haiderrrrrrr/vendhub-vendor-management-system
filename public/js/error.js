// Function to display an error message
function showError(message) {
  const errorContainer = document.getElementById("error-message");
  const errorText = document.getElementById("error-text");

  errorText.innerText = message;
  errorContainer.classList.add("show");

  // Automatically hide the error after 5 seconds
  setTimeout(() => {
    errorContainer.classList.remove("show");
  }, 5000);
}

// Function to close the error manually
function closeError() {
  const errorContainer = document.getElementById("error-message");
  errorContainer.classList.remove("show");
}
