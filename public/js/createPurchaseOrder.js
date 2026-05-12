document.addEventListener("DOMContentLoaded", () => {
  // Fetch departments and vendors separately
  fetchDepartments();
  fetchVendors();

  // Handle form submission
  const form = document.getElementById("purchase-order-form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const departmentId = document.getElementById("department_id").value;
    const vendorId = document.getElementById("vendor_id").value;
    const poDate = document.getElementById("po_date").value;
    const totalCost = document.getElementById("total_cost").value;
    const approvalStatus = document.getElementById("approval_status").value;

    // Validate form data
    if (
      !departmentId ||
      !vendorId ||
      !poDate ||
      !totalCost ||
      !approvalStatus
    ) {
      showError("Please fill in all required fields.");
      return;
    }

    // Collect all item data
    const items = [];
    const itemElements = document.querySelectorAll(".item");
    itemElements.forEach((item) => {
      const description = item.querySelector(".item-description").value;
      const quantity = item.querySelector(".item-quantity").value;
      const unitPrice = item.querySelector(".item-unit-price").value;

      if (description && quantity && unitPrice) {
        items.push({
          description,
          quantity: parseInt(quantity),
          unit_price: parseFloat(unitPrice),
        });
      }
    });

    // Validate that at least one item is added
    if (items.length === 0) {
      showError("Please add at least one item.");
      return;
    }

    // Validate that total cost matches item total cost
    const calculatedTotalCost = items.reduce(
      (acc, item) => acc + item.quantity * item.unit_price,
      0
    );
    if (Math.abs(calculatedTotalCost - parseFloat(totalCost)) > 0.01) {
      showError("Total cost does not match the sum of the item costs.");
      return;
    }

    // Prepare data to be sent in the request
    const formData = {
      department_id: departmentId,
      vendor_id: vendorId,
      po_date: poDate,
      total_cost: parseFloat(totalCost),
      approval_status: approvalStatus,
      items: items, // Send the items array
    };

    // Send data to backend to create the purchase order
    apiFetch("/api/purchase-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("Purchase Order Created Successfully!");
          form.reset(); // Reset the form
          clearItems(); // Clear the item inputs
        } else {
          showError("Error: " + data.message);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        showError("There was an error creating the purchase order.");
      });
  });
});

// Fetch departments from the server
function fetchDepartments() {
  apiFetch("/api/departments")
    .then((response) => response.json())
    .then((data) => {
      console.log("Departments response:", data);
      if (data.success) {
        populateDepartmentDropdown(data.departments);
      } else {
        showError("Error fetching departments.");
      }
    })
    .catch((error) => {
      console.error("Error fetching departments:", error);
      showError("Error fetching departments: " + error.message);
    });
}

// Fetch vendors from the server
function fetchVendors() {
  apiFetch("/api/vendors")
    .then((response) => response.json())
    .then((data) => {
      console.log("Vendors response:", data);
      if (data.success) {
        populateVendorDropdown(data.vendors);
      } else {
        showError("Error fetching vendors.");
      }
    })
    .catch((error) => {
      console.error("Error fetching vendors:", error);
      showError("Error fetching vendors: " + error.message);
    });
}

// Populate department dropdown
function populateDepartmentDropdown(departments) {
  const departmentSelect = document.getElementById("department_id");
  departments.forEach((department) => {
    const option = document.createElement("option");
    option.value = department.department_id;
    option.textContent = department.department_name;
    departmentSelect.appendChild(option);
  });
}

// Populate vendor dropdown
function populateVendorDropdown(vendors) {
  const vendorSelect = document.getElementById("vendor_id");
  vendors.forEach((vendor) => {
    const option = document.createElement("option");
    option.value = vendor.vendor_id;
    option.textContent = vendor.company_name;
    vendorSelect.appendChild(option);
  });
}

// Add an item to the list
document.getElementById("add-item").addEventListener("click", function () {
  const itemContainer = document.createElement("div");
  itemContainer.classList.add("item");

  itemContainer.innerHTML = `
    <label for="item_description">Item Description:</label>
    <input type="text" class="item-description" required />
  
    <label for="item_quantity">Quantity:</label>
    <input type="number" class="item-quantity" required />
  
    <label for="item_unit_price">Unit Price:</label>
    <input type="number" class="item-unit-price" required />
  `;

  document.getElementById("items-container").appendChild(itemContainer);
});

// Clear item fields (after successful order creation)
function clearItems() {
  const itemsContainer = document.getElementById("items-container");
  itemsContainer.innerHTML = ""; // Clears all item input fields
}

// Show error message
