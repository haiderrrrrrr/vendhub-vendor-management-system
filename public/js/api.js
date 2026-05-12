function apiFetch(url, options = {}) {
  const token = localStorage.getItem("jwtToken");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };
  return fetch(url, { ...options, headers });
}

function loadVendorDropdown(selectId) {
  return apiFetch("/api/vendors")
    .then((r) => r.json())
    .then((data) => {
      if (!data.success) throw new Error("Failed to fetch vendors.");
      const select = document.getElementById(selectId);
      if (!select) return;
      data.vendors.forEach((v) => {
        const opt = document.createElement("option");
        opt.value = v.vendor_id;
        opt.textContent = v.company_name;
        select.appendChild(opt);
      });
    })
    .catch((err) => showError(err.message || "Error fetching vendors."));
}
