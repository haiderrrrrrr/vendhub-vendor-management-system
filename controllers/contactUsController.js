const nodemailer = require("nodemailer");

// Create a transporter for Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper function to send email
const sendEmail = (toEmail, subject, html) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: subject,
    html: html,
  };

  return transporter.sendMail(mailOptions);
};

// Contact form handler
const handleContactForm = async (req, res) => {
  const { name, email, phone, message } = req.body;

  // Basic validation (optional)
  if (!name || !email || !phone || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  // Prepare email content
  const emailContent = `
    <h3>Contact Form Submission</h3>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Message:</strong></p>
    <p>${message}</p>
  `;

  try {
    // Send email (replace with your target email address)
    await sendEmail(
      "testingprojectmail2024@gmail.com",
      `New Contact Form Submission from ${name}`,
      emailContent
    );

    // Send a success response
    res
      .status(200)
      .json({ message: "Your message has been sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({
      error: "There was an error sending your message. Please try again later.",
    });
  }
};

module.exports = { handleContactForm };
