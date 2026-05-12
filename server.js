require("dotenv").config();
const express = require("express");
const path = require("path");
const rateLimit = require("express-rate-limit");
const db = require("./config/db");
const jwtAuth = require("./middleware/jwtAuth");
const chatbotController = require("./controllers/chatbotController");
const userRoutes = require("./routes/userRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const auserRoutes = require("./routes/auserRoutes");
const purchaseOrderRoutes = require("./routes/purchaseOrderRoutes");
const contractRoutes = require("./routes/contractRoutes");
const updateContractRoutes = require("./routes/updateContractRoutes");
const expirycontractsRoutes = require("./routes/checkContractExpiryRoutes");
const performanceEvaluationRoutes = require("./routes/giveRatingRoutes");
const getPerformanceRoutes = require("./routes/getRatingRoutes");
const budgetAlertsRoutes = require("./routes/checkDeparmtenBudgetRoutes");
const budgetRoutes = require("./routes/createBudgetRoutes");
const getBudgetRoutes = require("./routes/getBudgetRoutes");
const updateBudgetRoutes = require("./routes/updateBudgetRoutes");
const getVendorRoutes = require("./routes/getVendorRoutes");
const deleteVendorRoutes = require("./routes/deleteVendorRoutes");
const complianceRoutes = require("./routes/checkComplianceRoutes");
const updateVendorRoutes = require("./routes/updateVendorRoutes");

const contactUsRoutes = require("./routes/contactUsRoute");
const PORT = process.env.PORT || 3000;
const app = express();

// Middleware for parsing JSON and URL-encoded data
app.set("trust proxy", 1);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/html/welcomePage.html"));
});

app.get("/registration", (req, res) => {
  res.sendFile(path.join(__dirname, "public/html/registration.html"));
});

app.get("/adminDashboard", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public/html/Admin Panel/adminDashboard.html")
  );
});

app.get("/budgetManager", (req, res) => {
  res.sendFile(path.join(__dirname, "public/html/BudgetManager.html"));
});

app.get("/index", (req, res) => {
  res.sendFile(path.join(__dirname, "public/html/index.html"));
});

app.get("/faqs", (req, res) => {
  res.sendFile(path.join(__dirname, "public/html/FAQs/faqs.html"));
});

app.get("/vendorDashboard", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public/html/Vendor Panel/vendorDashboard.html")
  );
});

app.get("/createVendor", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public/html/Admin Panel/createVendor.html")
  );
});

app.get("/getVendor", (req, res) => {
  res.sendFile(path.join(__dirname, "public/html/Admin Panel/getVendor.html"));
});
app.get("/updateVendor", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public/html/Admin Panel/updateVendor.html")
  );
});

app.get("/deleteVendor", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public/html/Admin Panel/deleteVendor.html")
  );
});

app.get("/checkCompliance", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public/html/Admin Panel/checkCompliance.html")
  );
});

app.get("/createUser", (req, res) => {
  res.sendFile(path.join(__dirname, "public/html/Admin Panel/createUser.html"));
});

app.get("/updateUser", (req, res) => {
  res.sendFile(path.join(__dirname, "public/html/Admin Panel/updateUser.html"));
});

app.get("/deleteUser", (req, res) => {
  res.sendFile(path.join(__dirname, "public/html/Admin Panel/deleteUser.html"));
});

app.get("/getUser", (req, res) => {
  res.sendFile(path.join(__dirname, "public/html/Admin Panel/getUser.html"));
});

app.get("/createPurchaseOrder", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public/html/Admin Panel/createPurchaseOrder.html")
  );
});

app.get("/getPurchaseOrder", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public/html/Admin Panel/getPurchaseOrder.html")
  );
});

app.get("/checkDepartmentBudget", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public/html/Admin Panel/checkDepartmentBudget.html")
  );
});

app.get("/createContract", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public/html/Admin Panel/createContract.html")
  );
});

app.get("/getContract", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public/html/Admin Panel/getContract.html")
  );
});

app.get("/updateContract", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public/html/Admin Panel/updateContract.html")
  );
});

app.get("/checkContractExpiry", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public/html/Admin Panel/checkContractExpiry.html")
  );
});

app.get("/contactUs", (req, res) => {
  res.sendFile(path.join(__dirname, "public/html/Contact us/contactUs.html"));
});

app.get("/giveRating", (req, res) => {
  res.sendFile(path.join(__dirname, "public/html/Admin Panel/giveRating.html"));
});

app.get("/getRating", (req, res) => {
  res.sendFile(path.join(__dirname, "public/html/Admin Panel/getRating.html"));
});

app.get("/createBudget", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public/html/Admin Panel/createBudget.html")
  );
});

app.get("/getBudget", (req, res) => {
  res.sendFile(path.join(__dirname, "public/html/Admin Panel/getBudget.html"));
});

app.get("/updateBudget", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public/html/Admin Panel/updateBudget.html")
  );
});

// Budget Manager Dashboard
app.get("/budgetManagerDashboard", (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "public/html/Budget Manager/budgetManagerDashboard.html"
    )
  );
});

app.get("/bmcreateBudget", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public/html/Budget Manager/bmcreateBudget.html")
  );
});

app.get("/bmgetBudget", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public/html/Budget Manager/bmgetBudget.html")
  );
});

app.get("/bmupdateBudget", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public/html/Budget Manager/bmupdateBudget.html")
  );
});

app.get("/bmfaqs", (req, res) => {
  res.sendFile(path.join(__dirname, "public/html/Budget Manager/bmfaqs.html"));
});

app.get("/bmcontactUs", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public/html/Budget Manager/bmcontactUs.html")
  );
});

// Finance Team Dashboard
app.get("/financeTeamDashboard", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public/html/Finance Team/financeTeamDashboard.html")
  );
});

app.get("/ftcreateBudget", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public/html/Finance Team/ftcreateBudget.html")
  );
});

app.get("/ftgetBudget", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public/html/Finance Team/ftgetBudget.html")
  );
});

app.get("/ftupdateBudget", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public/html/Finance Team/ftupdateBudget.html")
  );
});

app.get("/ftfaqs", (req, res) => {
  res.sendFile(path.join(__dirname, "public/html/Finance Team/ftfaqs.html"));
});

app.get("/ftcontactUs", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public/html/Finance Team/ftcontactUs.html")
  );
});

// Department Head Dashboard
app.get("/departmentHeadsDashboard", (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "public/html/Department Heads/departmentHeadsDashboard.html"
    )
  );
});

app.get("/dhcreatePurchaseOrder", (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "public/html/Department Heads/dhcreatePurchaseOrder.html"
    )
  );
});

app.get("/dhgetPurchaseOrder", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public/html/Department Heads/dhgetPurchaseOrder.html")
  );
});

app.get("/dhcheckDepartmentBudget", (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "public/html/Department Heads/dhcheckDepartmentBudget.html"
    )
  );
});

app.get("/dhgiveRating", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public/html/Department Heads/dhgiveRating.html")
  );
});

app.get("/dhgetRating", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public/html/Department Heads/dhgetRating.html")
  );
});

app.get("/dhfaqs", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public/html/Department Heads/dhfaqs.html")
  );
});

app.get("/dhcontactUs", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public/html/Department Heads/dhcontactUs.html")
  );
});

// Procurement Team Dashboard
app.get("/procurementTeamDashboard", (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "public/html/Procurement Team/procurementTeamDashboard.html"
    )
  );
});

app.get("/ptcreatePurchaseOrder", (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "public/html/Procurement Team/ptcreatePurchaseOrder.html"
    )
  );
});

app.get("/ptgetPurchaseOrder", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public/html/Procurement Team/ptgetPurchaseOrder.html")
  );
});

app.get("/ptcheckDepartmentBudget", (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "public/html/Procurement Team/ptcheckDepartmentBudget.html"
    )
  );
});

app.get("/ptgiveRating", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public/html/Procurement Team/ptgiveRating.html")
  );
});

app.get("/ptgetRating", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public/html/Procurement Team/ptgetRating.html")
  );
});

app.get("/ptfaqs", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public/html/Procurement Team/ptfaqs.html")
  );
});

app.get("/ptcontactUs", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public/html/Procurement Team/ptcontactUs.html")
  );
});

// Vendor Management Team Dashboard
app.get("/vendorManagementTeamDashboard", (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "public/html/Vendor Management Team/vendorManagementTeamDashboard.html"
    )
  );
});

app.get("/vmgetVendor", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public/html/Vendor Management Team/vmgetVendor.html")
  );
});

app.get("/vmcreateVendor", (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "public/html/Vendor Management Team/vmcreateVendor.html"
    )
  );
});

app.get("/vmupdateVendor", (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "public/html/Vendor Management Team/vmupdateVendor.html"
    )
  );
});

app.get("/vmdeleteVendor", (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "public/html/Vendor Management Team/vmdeleteVendor.html"
    )
  );
});

app.get("/vmcheckCompliance", (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "public/html/Vendor Management Team/vmcheckCompliance.html"
    )
  );
});

app.get("/vmcontactUs", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public/html/Vendor Management Team/vmcontactUs.html")
  );
});

app.get("/vmfaqs", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public/html/Vendor Management Team/vmfaqs.html")
  );
});

// Contract Management Team Dashboard
app.get("/contractManagementTeamDashboard", (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "public/html/Contract Management Team/contractManagementTeamDashboard.html"
    )
  );
});

app.get("/cmtcreateContract", (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "public/html/Contract Management Team/cmtcreateContract.html"
    )
  );
});

app.get("/cmtgetContract", (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "public/html/Contract Management Team/cmtgetContract.html"
    )
  );
});

app.get("/cmtupdateContract", (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "public/html/Contract Management Team/cmtupdateContract.html"
    )
  );
});

app.get("/cmtcheckContractExpiry", (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "public/html/Contract Management Team/cmtcheckContractExpiry.html"
    )
  );
});

app.get("/cmtfaqs", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public/html/Contract Management Team/cmtfaqs.html")
  );
});

app.get("/cmtcontactUs", (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "public/html/Contract Management Team/cmtcontactUs.html"
    )
  );
});

// Procurement Manager Dashboard
app.get("/procurementManagerDashboard", (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "public/html/Procurement Manager/procurementManagerDashboard.html"
    )
  );
});

app.get("/pmagetVendor", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public/html/Procurement Manager/pmagetVendor.html")
  );
});

app.get("/pmacreateVendor", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public/html/Procurement Manager/pmacreateVendor.html")
  );
});

app.get("/pmaupdateVendor", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public/html/Procurement Manager/pmaupdateVendor.html")
  );
});

app.get("/pmadeleteVendor", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public/html/Procurement Manager/pmadeleteVendor.html")
  );
});

app.get("/pmacheckCompliance", (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "public/html/Procurement Manager/pmacheckCompliance.html"
    )
  );
});

app.get("/pmacreateContract", (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "public/html/Procurement Manager/pmacreateContract.html"
    )
  );
});

app.get("/pmagetContract", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public/html/Procurement Manager/pmagetContract.html")
  );
});

app.get("/pmaupdateContract", (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "public/html/Procurement Manager/pmaupdateContract.html"
    )
  );
});

app.get("/pmacheckContractExpiry", (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "public/html/Procurement Manager/pmacheckContractExpiry.html"
    )
  );
});

app.get("/pmafaqs", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public/html/Procurement Manager/pmafaqs.html")
  );
});

app.get("/pmacontactUs", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public/html/Procurement Manager/pmacontactUs.html")
  );
});

app.get("/vscontactUs", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public/html/Vendor Panel/vscontactUs.html")
  );
});

app.get("/vsupdateVendor", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public/html/Vendor Panel/vsupdateVendor.html")
  );
});

app.get("/vscheckCompliance", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public/html/Vendor Panel/vscheckCompliance.html")
  );
});

app.get("/vsgetContract", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public/html/Vendor Panel/vsgetContract.html")
  );
});

app.get("/vscheckContractExpiry", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public/html/Vendor Panel/vscheckContractExpiry.html")
  );
});

app.get("/vsgetRating", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public/html/Vendor Panel/vsgetRating.html")
  );
});

app.get("/vsfaqs", (req, res) => {
  res.sendFile(path.join(__dirname, "public/html/Vendor Panel/vsfaqs.html"));
});
// Rate-limit login to prevent brute-force attacks
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Too many login attempts. Try again in 15 minutes." },
});
app.use("/api/login", loginLimiter);

// Protect all /api routes except login and signup
app.use("/api", (req, res, next) => {
  if (req.path === "/login" || req.path === "/signup") return next();
  return jwtAuth(req, res, next);
});

// Chatbot proxy (keeps API key server-side)
app.post("/api/chatbot/message", chatbotController.sendMessage);

// Using Routes
app.use("/api/vendor", vendorRoutes);
app.use("/api", userRoutes);
app.use("/api", auserRoutes);
app.use("/api", purchaseOrderRoutes);
app.use("/api", contractRoutes);
app.use("/api/contracts", updateContractRoutes);
app.use("/api", expirycontractsRoutes);
app.use(contactUsRoutes);
app.use("/api/performance-evaluation", performanceEvaluationRoutes);
app.use("/api", getPerformanceRoutes);
app.use("/api", budgetAlertsRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api", getBudgetRoutes);
app.use("/api", updateBudgetRoutes);
app.use("/api", getVendorRoutes);
app.use("/api", deleteVendorRoutes);
app.use("/api", complianceRoutes);
app.use("/api", updateVendorRoutes);

// Protected Route
app.get("/api/protected", jwtAuth, (req, res) => {
  res.status(200).json({
    message: "This is a protected route. You are authenticated.",
    user: req.user,
  });
});

// Token verification route
app.post("/api/verify-token", jwtAuth, (req, res) => {
  res.status(200).json({ message: "Token is valid" });
});

// Centralized error handler — catches anything thrown/passed via next(err)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal server error" });
});

// Start the server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

module.exports = app;
