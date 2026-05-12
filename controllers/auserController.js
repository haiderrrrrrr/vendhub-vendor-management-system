const bcrypt = require("bcryptjs");
const db = require("../config/db");

const createUser = (req, res) => {
  const { username, password, email, role_id } = req.body;

  // Validate email format using a regular expression
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email format.",
    });
  }

  // Validate password
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      success: false,
      message:
        "Password must be at least 6 characters long, contain one uppercase letter, one lowercase letter, and one special character.",
    });
  }

  // Check if the username or email already exists
  db.query(
    "SELECT * FROM User WHERE username = ? OR email = ?",
    [username, email],
    (err, results) => {
      if (err) {
        console.error("Database query error:", err);
        return res
          .status(500)
          .json({ success: false, message: "Database query error." });
      }

      if (results.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Username or email already exists.",
        });
      }

      // Hash the password
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          console.error("Error hashing password:", err);
          return res.status(500).json({
            success: false,
            message: "Error hashing the password.",
          });
        }

        // Insert into User table
        db.query(
          "INSERT INTO User (username, password, email) VALUES (?, ?, ?)",
          [username, hashedPassword, email],
          (err, result) => {
            if (err) {
              console.error("Error inserting user:", err);
              return res.status(500).json({
                success: false,
                message: "Error inserting user into the database.",
              });
            }

            const user_id = result.insertId;

            // Insert role assignment
            db.query(
              "INSERT INTO UserRole (user_id, role_id) VALUES (?, ?)",
              [user_id, role_id],
              (err, result) => {
                if (err) {
                  console.error("Error assigning role:", err);
                  return res.status(500).json({
                    success: false,
                    message: "Error assigning role to the user.",
                  });
                }

                res.status(201).json({
                  success: true,
                  message: "User created successfully.",
                });
              }
            );
          }
        );
      });
    }
  );
};

module.exports = { createUser };
