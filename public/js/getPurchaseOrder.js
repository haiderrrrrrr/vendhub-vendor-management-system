document.addEventListener("DOMContentLoaded", function () {
  const fetchPurchaseOrdersBtn = document.getElementById("track-po-btn");
  const purchaseOrdersTable = document.getElementById("purchase-orders-table");
  const tableBody = purchaseOrdersTable.querySelector("tbody");

  // Fetch and display purchase orders
  const fetchPurchaseOrders = async () => {
    try {
      const response = await apiFetch("/api/get-purchase-orders");

      if (!response.ok) {
        throw new Error("Failed to fetch purchase orders from the server.");
      }

      const purchaseOrders = await response.json();

      if (purchaseOrders.length > 0) {
        // Clear the existing table
        tableBody.innerHTML = "";

        // Populate the table with purchase order data
        purchaseOrders.forEach((po) => {
          // Create a table row for each purchase order
          const row = document.createElement("tr");

          // Add only the desired columns to the row
          row.innerHTML = `
            <td>${po.po_id}</td>
            <td>${po.department_name}</td>
            <td>${po.vendor_name}</td>
            <td>${po.po_date}</td>
            <td>${po.total_cost}</td>
            <td class="${po.status_color}">${po.approval_status}</td>
          `;

          // Append the row to the table body
          tableBody.appendChild(row);
        });

        // Show the table if it was hidden
        purchaseOrdersTable.style.display = "table";
      } else {
        // Handle case when no purchase orders are found
        tableBody.innerHTML =
          "<tr><td colspan='6'>No purchase orders found.</td></tr>";
        purchaseOrdersTable.style.display = "table";
      }
    } catch (error) {
      console.error("Error fetching purchase orders:", error);
      showError("Error fetching purchase orders. Please try again later.");
    }
  };

  // Event listener for the "Track Purchase Orders" button
  fetchPurchaseOrdersBtn.addEventListener("click", fetchPurchaseOrders);

  // Generate report when the "Generate Report" button is clicked
  document
    .getElementById("generate-report-btn")
    .addEventListener("click", function () {
      // Trigger the API call to generate the purchase orders report
      apiFetch("/api/generate-purchase-orders-report")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error generating purchase orders report.");
          }
          return response.blob(); // Get the PDF as a Blob
        })
        .then((blob) => {
          // Create a link element to trigger the download
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = "purchase_orders_report.pdf";
          link.click(); // Trigger the download
        })
        .catch((error) => {
          console.error(error);
          showError("There was an error generating the report.");
        });
    });
});

// Function to show error messages
