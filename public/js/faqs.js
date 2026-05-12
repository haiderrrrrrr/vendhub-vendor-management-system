// Select all accordion-content elements (regardless of their group)
document.querySelectorAll(".accordion-content").forEach((item) => {
  item.querySelector("header").addEventListener("click", () => {
    const isOpen = item.classList.contains("open");

    document.querySelectorAll(".accordion-content").forEach((content) => {
      content.classList.remove("open");
      content.querySelector(".description").style.height = "0";
      content.querySelector("i").classList.replace("fa-minus", "fa-plus");
    });

    if (!isOpen) {
      item.classList.add("open");
      const description = item.querySelector(".description");
      description.style.height = `${description.scrollHeight + 15}px`;
      item.querySelector("i").classList.replace("fa-plus", "fa-minus");
    }
  });
});

// faqs.js (or a script tag within faqs.html)
document.addEventListener("DOMContentLoaded", () => {
  // Check if there's a JWT token in localStorage
  const token = localStorage.getItem("jwtToken");

  if (!token) {
    // If there's no token, redirect to login page
    window.location.href = "/login"; // Redirect to login page
    return;
  }

  // Optionally, verify the token by sending it to your backend
  fetch("/api/verify-token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (response.ok) {
        // If token is valid, the user can stay on the FAQ page
        console.log("Token is valid, accessing the FAQ page...");
      } else {
        // If token verification fails, redirect to login page
        window.location.href = "/login";
      }
    })
    .catch((err) => {
      console.error("Error verifying token:", err);
      window.location.href = "/login"; // Handle token verification failure by redirecting to login
    });
});
