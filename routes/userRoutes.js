const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const jwtAuth = require("../middleware/jwtAuth"); // Import the JWT middleware

// Registration route (open to everyone)
router.post("/signup", userController.registerUser);

// Login route (open to everyone)
router.post("/login", userController.loginUser);

// Example of a protected route (requires JWT)
router.get("/profile", jwtAuth, (req, res) => {
  // This route will only be accessible if the JWT token is valid
  res.status(200).json({ message: "Welcome to your profile!", user: req.user });
});

module.exports = router;
