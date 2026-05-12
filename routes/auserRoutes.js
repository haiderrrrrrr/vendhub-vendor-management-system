const express = require("express");
const router = express.Router();
const { createUser } = require("../controllers/auserController");
const {
  generateReport,
  getUsers,
} = require("../controllers/agetUserController");
const { updateUser } = require("../controllers/aupdateUserController");
const { deleteUser } = require("../controllers/adeleteUserController");
const db = require("../config/db");

// Route to create a new user
router.post("/users", createUser);
router.get("/users", getUsers);
router.get("/generate-report", generateReport);
// Route to update an existing user
router.put("/users/:user_id", updateUser);

router.delete("/users/:user_id", deleteUser);

// Route to get all users (for fetching users to populate the dropdown)
router.get("/users", (req, res) => {
  db.query("SELECT * FROM User", (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Error fetching users from the database.",
      });
    }
    res.status(200).json(results);
  });
});

// Route to get roles (for role selection in both Create and Update forms)
router.get("/roles", (req, res) => {
  db.query("SELECT * FROM Role", (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Error fetching roles from the database.",
      });
    }
    res.status(200).json(results);
  });
});

// Route to get a specific user by ID
router.get("/users/:user_id", (req, res) => {
  const userId = req.params.user_id;

  db.query("SELECT * FROM User WHERE user_id = ?", [userId], (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Error fetching user data.",
      });
    }

    if (results.length > 0) {
      const user = results[0];

      // Fetch role for the user
      db.query(
        "SELECT * FROM Role WHERE role_id = ?",
        [user.role_id],
        (err, roleResults) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: "Error fetching user role.",
            });
          }

          // Assuming roleResults contains the role info
          user.role_name =
            roleResults.length > 0 ? roleResults[0].role_name : null;

          res.status(200).json(user);
        }
      );
    } else {
      res.status(404).json({ success: false, message: "User not found." });
    }
  });
});

module.exports = router;
