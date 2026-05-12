const express = require("express");
const router = express.Router();
const { handleContactForm } = require("../controllers/contactUsController");

// Route for handling the contact form submission
router.post("/send-contact-form", handleContactForm);

module.exports = router;
