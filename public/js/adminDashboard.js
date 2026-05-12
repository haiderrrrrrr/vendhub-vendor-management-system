document.addEventListener("DOMContentLoaded", function () {
  const sidebarItems = document.querySelectorAll(".sidebar li.nav-link");

  sidebarItems.forEach((item) => {
    let clickTimeout;

    // On mouse click (click on the parent item)
    item.addEventListener("click", function () {
      const submenu = item.querySelector(".submenu");

      // Show submenu immediately
      submenu.style.display = "block";
      setTimeout(function () {
        submenu.style.opacity = 1; // Show submenu with smooth transition
      }, 0); // Execute immediately

      // Set the timeout to hide submenu after 2 seconds
      clickTimeout = setTimeout(() => {
        submenu.style.opacity = 0;
        setTimeout(() => {
          submenu.style.display = "none"; // Hide submenu after opacity transition
        }, 300); // Wait for opacity transition to finish before hiding it
      }, 2000); // 2 seconds

      // If the mouse enters the submenu, clear the timeout
      submenu.addEventListener("mouseenter", function () {
        clearTimeout(clickTimeout); // Keep submenu open if mouse enters submenu
      });

      // If the mouse leaves the submenu, hide the submenu after 2 seconds
      submenu.addEventListener("mouseleave", function () {
        clickTimeout = setTimeout(() => {
          submenu.style.opacity = 0;
          setTimeout(() => {
            submenu.style.display = "none"; // Hide submenu after opacity transition
          }, 300); // Wait for opacity transition to finish before hiding it
        }, 5000); // 2 seconds
      });
    });
  });
});
