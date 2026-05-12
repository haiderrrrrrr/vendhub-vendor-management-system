(function () {
  const role = localStorage.getItem("userRole");

  const dashboardUrl = {
    Admin: "/adminDashboard",
    Vendor: "/vendorDashboard",
    "Budget Manager": "/budgetManagerDashboard",
    "Finance Team": "/financeTeamDashboard",
    "Department Heads": "/departmentHeadsDashboard",
    "Procurement Team": "/procurementTeamDashboard",
    "Vendor Management Team": "/vendorManagementTeamDashboard",
    "Contract Management Team": "/contractManagementTeamDashboard",
    "Procurement Manager": "/procurementManagerDashboard",
  };

  const menuConfigs = {
    Admin: [
      { icon: "bx bx-home-alt", label: "Dashboard", href: "/adminDashboard" },
      {
        icon: "bx bx-user",
        label: "User Management",
        submenu: [
          { label: "Create User", href: "/createUser" },
          { label: "View Users", href: "/getUser" },
          { label: "Update User", href: "/updateUser" },
          { label: "Delete User", href: "/deleteUser" },
        ],
      },
      {
        icon: "bx bx-building-house",
        label: "Vendor Management",
        submenu: [
          { label: "View Vendors", href: "/getVendor" },
          { label: "Create Vendor", href: "/createVendor" },
          { label: "Update Vendor", href: "/updateVendor" },
          { label: "Delete Vendor", href: "/deleteVendor" },
          { label: "Certification Check", href: "/checkCompliance" },
        ],
      },
      {
        icon: "bx bx-cart",
        label: "Purchase Order Management",
        submenu: [
          { label: "Create Purchase Order", href: "/createPurchaseOrder" },
          { label: "Track Purchase Orders", href: "/getPurchaseOrder" },
          { label: "Budget Validation", href: "/checkDepartmentBudget" },
        ],
      },
      {
        icon: "bx bx-file",
        label: "Contract Management",
        submenu: [
          { label: "Create Contracts", href: "/createContract" },
          { label: "View Contracts", href: "/getContract" },
          { label: "Renew Contracts", href: "/updateContract" },
          { label: "Set Expiration Alerts", href: "/checkContractExpiry" },
        ],
      },
      {
        icon: "bx bx-wallet",
        label: "Budget Management",
        submenu: [
          { label: "Create Budget", href: "/createBudget" },
          { label: "View Budget Overview", href: "/getBudget" },
          { label: "Adjust Budgets", href: "/updateBudget" },
        ],
      },
      {
        icon: "bx bx-star",
        label: "Performance Evaluation",
        submenu: [
          { label: "Create Evaluation", href: "/giveRating" },
          { label: "Update Evaluation", href: "/getRating" },
        ],
      },
      {
        icon: "bx bx-user-circle",
        label: "Vendhub Dashboards",
        submenu: [
          { label: "Vendor Dashboard", href: "/vendorDashboard" },
          { label: "Procurement Manager Dashboard", href: "/procurementManagerDashboard" },
          { label: "Contract Management Team Dashboard", href: "/contractManagementTeamDashboard" },
          { label: "Vendor Management Team Dashboard", href: "/vendorManagementTeamDashboard" },
          { label: "Procurement Team Dashboard", href: "/procurementTeamDashboard" },
          { label: "Department Heads Dashboard", href: "/departmentHeadsDashboard" },
          { label: "Budget Manager Dashboard", href: "/budgetManagerDashboard" },
          { label: "Finance Team Dashboard", href: "/financeTeamDashboard" },
        ],
      },
      { icon: "bx bx-question-mark", label: "Frequently Asked Questions", href: "/faqs" },
      { icon: "bx bx-phone", label: "Contact Us", href: "/contactUs" },
      { icon: "bx bx-log-out", label: "Logout", href: "/registration" },
    ],

    Vendor: [
      { icon: "bx bx-home-alt", label: "Dashboard", href: "/vendorDashboard" },
      {
        icon: "bx bx-building-house",
        label: "Vendor Management",
        submenu: [
          { label: "Update Profile", href: "/vsupdateVendor" },
          { label: "Certification Check", href: "/vscheckCompliance" },
        ],
      },
      {
        icon: "bx bx-file",
        label: "Contract Management",
        submenu: [
          { label: "View Vendors Contracts", href: "/vsgetContract" },
          { label: "Set Expiration Alerts", href: "/vscheckContractExpiry" },
        ],
      },
      {
        icon: "bx bx-star",
        label: "Performance Evaluation",
        submenu: [{ label: "Vendor Evaluation", href: "/vsgetRating" }],
      },
      { icon: "bx bx-question-mark", label: "Frequently Asked Questions", href: "/vsfaqs" },
      { icon: "bx bx-phone", label: "Contact Us", href: "/vscontactUs" },
      { icon: "bx bx-log-out", label: "Logout", href: "/registration" },
    ],

    "Budget Manager": [
      { icon: "bx bx-home-alt", label: "Dashboard", href: "/budgetManagerDashboard" },
      {
        icon: "bx bx-wallet",
        label: "Budget Management",
        submenu: [
          { label: "Create Budget", href: "/bmcreateBudget" },
          { label: "View Budget Overview", href: "/bmgetBudget" },
          { label: "Adjust Budgets", href: "/bmupdateBudget" },
        ],
      },
      { icon: "bx bx-question-mark", label: "Frequently Asked Questions", href: "/bmfaqs" },
      { icon: "bx bx-phone", label: "Contact Us", href: "/bmcontactUs" },
      { icon: "bx bx-log-out", label: "Logout", href: "/registration" },
    ],

    "Finance Team": [
      { icon: "bx bx-home-alt", label: "Dashboard", href: "/financeTeamDashboard" },
      {
        icon: "bx bx-wallet",
        label: "Budget Management",
        submenu: [
          { label: "Create Budget", href: "/ftcreateBudget" },
          { label: "View Budget Overview", href: "/ftgetBudget" },
          { label: "Adjust Budgets", href: "/ftupdateBudget" },
        ],
      },
      { icon: "bx bx-question-mark", label: "Frequently Asked Questions", href: "/ftfaqs" },
      { icon: "bx bx-phone", label: "Contact Us", href: "/ftcontactUs" },
      { icon: "bx bx-log-out", label: "Logout", href: "/registration" },
    ],

    "Department Heads": [
      { icon: "bx bx-home-alt", label: "Dashboard", href: "/departmentHeadsDashboard" },
      {
        icon: "bx bx-cart",
        label: "Purchase Order Management",
        submenu: [
          { label: "Create Purchase Order", href: "/dhcreatePurchaseOrder" },
          { label: "Track Purchase Orders", href: "/dhgetPurchaseOrder" },
          { label: "Budget Validation", href: "/dhcheckDepartmentBudget" },
        ],
      },
      {
        icon: "bx bx-star",
        label: "Performance Evaluation",
        submenu: [
          { label: "Create Evaluation", href: "/dhgiveRating" },
          { label: "Update Evaluation", href: "/dhgetRating" },
        ],
      },
      { icon: "bx bx-question-mark", label: "Frequently Asked Questions", href: "/dhfaqs" },
      { icon: "bx bx-phone", label: "Contact Us", href: "/dhcontactUs" },
      { icon: "bx bx-log-out", label: "Logout", href: "/registration" },
    ],

    "Procurement Team": [
      { icon: "bx bx-home-alt", label: "Dashboard", href: "/procurementTeamDashboard" },
      {
        icon: "bx bx-cart",
        label: "Purchase Order Management",
        submenu: [
          { label: "Create Purchase Order", href: "/ptcreatePurchaseOrder" },
          { label: "Track Purchase Orders", href: "/ptgetPurchaseOrder" },
          { label: "Budget Validation", href: "/ptcheckDepartmentBudget" },
        ],
      },
      {
        icon: "bx bx-star",
        label: "Performance Evaluation",
        submenu: [
          { label: "Create Evaluation", href: "/ptgiveRating" },
          { label: "Update Evaluation", href: "/ptgetRating" },
        ],
      },
      { icon: "bx bx-question-mark", label: "Frequently Asked Questions", href: "/ptfaqs" },
      { icon: "bx bx-phone", label: "Contact Us", href: "/ptcontactUs" },
      { icon: "bx bx-log-out", label: "Logout", href: "/registration" },
    ],

    "Vendor Management Team": [
      { icon: "bx bx-home-alt", label: "Dashboard", href: "/vendorManagementTeamDashboard" },
      {
        icon: "bx bx-building-house",
        label: "Vendor Management",
        submenu: [
          { label: "View Vendors", href: "/vmgetVendor" },
          { label: "Create Vendor", href: "/vmcreateVendor" },
          { label: "Update Vendor", href: "/vmupdateVendor" },
          { label: "Delete Vendor", href: "/vmdeleteVendor" },
          { label: "Certification Check", href: "/vmcheckCompliance" },
        ],
      },
      { icon: "bx bx-question-mark", label: "Frequently Asked Questions", href: "/vmfaqs" },
      { icon: "bx bx-phone", label: "Contact Us", href: "/vmcontactUs" },
      { icon: "bx bx-log-out", label: "Logout", href: "/registration" },
    ],

    "Contract Management Team": [
      { icon: "bx bx-home-alt", label: "Dashboard", href: "/contractManagementTeamDashboard" },
      {
        icon: "bx bx-file",
        label: "Contract Management",
        submenu: [
          { label: "Create Contracts", href: "/cmtcreateContract" },
          { label: "View Contracts", href: "/cmtgetContract" },
          { label: "Renew Contracts", href: "/cmtupdateContract" },
          { label: "Set Expiration Alerts", href: "/cmtcheckContractExpiry" },
        ],
      },
      { icon: "bx bx-question-mark", label: "Frequently Asked Questions", href: "/cmtfaqs" },
      { icon: "bx bx-phone", label: "Contact Us", href: "/cmtcontactUs" },
      { icon: "bx bx-log-out", label: "Logout", href: "/registration" },
    ],

    "Procurement Manager": [
      { icon: "bx bx-home-alt", label: "Dashboard", href: "/procurementManagerDashboard" },
      {
        icon: "bx bx-building-house",
        label: "Vendor Management",
        submenu: [
          { label: "View Vendors", href: "/pmagetVendor" },
          { label: "Create Vendor", href: "/pmacreateVendor" },
          { label: "Update Vendor", href: "/pmaupdateVendor" },
          { label: "Delete Vendor", href: "/pmadeleteVendor" },
          { label: "Certification Check", href: "/pmacheckCompliance" },
        ],
      },
      {
        icon: "bx bx-file",
        label: "Contract Management",
        submenu: [
          { label: "Create Contracts", href: "/pmacreateContract" },
          { label: "View Contracts", href: "/pmagetContract" },
          { label: "Renew Contracts", href: "/pmaupdateContract" },
          { label: "Set Expiration Alerts", href: "/pmacheckContractExpiry" },
        ],
      },
      { icon: "bx bx-question-mark", label: "Frequently Asked Questions", href: "/pmafaqs" },
      { icon: "bx bx-phone", label: "Contact Us", href: "/pmacontactUs" },
      { icon: "bx bx-log-out", label: "Logout", href: "/registration" },
    ],
  };

  function buildMenuLinks(items) {
    return items
      .map((item) => {
        if (item.submenu) {
          const submenuItems = item.submenu
            .map((s) => `<li><a href="${s.href}">${s.label}</a></li>`)
            .join("\n              ");
          return `
          <li class="nav-link">
            <a href="#">
              <i class="${item.icon} icon"></i>
              <span class="text nav-text">${item.label}</span>
            </a>
            <ul class="submenu">
              ${submenuItems}
            </ul>
          </li>`;
        }
        return `
          <li class="nav-link">
            <a href="${item.href}">
              <i class="${item.icon} icon"></i>
              <span class="text nav-text">${item.label}</span>
            </a>
          </li>`;
      })
      .join("");
  }

  const links = menuConfigs[role] || [];

  const sidebarHTML = `
  <nav class="sidebar close">
    <header>
      <div class="image-text">
        <span class="image">
          <img src="../../assets/fav-icon.png" alt="fav-icon" />
        </span>
        <div class="text logo-text">
          <span class="name">Vendhub</span>
          <span class="profession">System</span>
        </div>
      </div>
      <i class="bx bx-chevron-right toggle"></i>
    </header>
    <div class="menu-bar">
      <div class="menu">
        <li class="search-box">
          <i class="bx bx-search icon"></i>
          <input type="text" placeholder="Search..." />
        </li>
        <ul class="menu-links">
          ${buildMenuLinks(links)}
        </ul>
      </div>
    </div>
  </nav>`;

  const mount = document.getElementById("sidebar-mount");
  if (mount) mount.innerHTML = sidebarHTML;

  // Sidebar open/close toggle
  document.addEventListener("DOMContentLoaded", function () {
    const sidebar = document.querySelector("nav.sidebar");
    const toggle = document.querySelector(".toggle");
    const searchBtn = document.querySelector(".search-box");

    if (toggle && sidebar) {
      toggle.addEventListener("click", () => sidebar.classList.toggle("close"));
    }
    if (searchBtn && sidebar) {
      searchBtn.addEventListener("click", () => sidebar.classList.remove("close"));
    }

    // Submenu toggle
    const navLinks = document.querySelectorAll(".sidebar li.nav-link");
    navLinks.forEach((item) => {
      let clickTimeout;
      item.addEventListener("click", function () {
        const submenu = item.querySelector(".submenu");
        if (!submenu) return;
        submenu.style.display = "block";
        setTimeout(() => { submenu.style.opacity = 1; }, 0);
        clickTimeout = setTimeout(() => {
          submenu.style.opacity = 0;
          setTimeout(() => { submenu.style.display = "none"; }, 300);
        }, 2000);
        submenu.addEventListener("mouseenter", () => clearTimeout(clickTimeout));
        submenu.addEventListener("mouseleave", () => {
          clickTimeout = setTimeout(() => {
            submenu.style.opacity = 0;
            setTimeout(() => { submenu.style.display = "none"; }, 300);
          }, 5000);
        });
      });
    });
  });
})();
