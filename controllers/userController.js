const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const JWT_SECRET = process.env.JWT_SECRET;

// User registration
exports.registerUser = (req, res) => {
  const { name, email, password, role_name } = req.body;

  if (!name || !email || !password || !role_name) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message:
        "Password must contain at least one uppercase, one lowercase, one number, one special character, and be at least 6 characters long",
    });
  }

  db.query("SELECT * FROM User WHERE email = ?", [email], (err, result) => {
    if (err) {
      console.error("Error checking email:", err);
      return res.status(500).json({ message: "Server error" });
    }
    if (result.length > 0) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error("Error hashing password:", err);
        return res.status(500).json({ message: "Server error" });
      }

      const insertUserQuery =
        "INSERT INTO User (username, email, password) VALUES (?, ?, ?)";
      db.query(insertUserQuery, [name, email, hashedPassword], (err, result) => {
        if (err) {
          console.error("Error inserting user:", err);
          return res.status(500).json({ message: "Server error" });
        }

        const userId = result.insertId;

        db.query(
          "SELECT role_id FROM Role WHERE role_name = ?",
          [role_name],
          (err, roleResult) => {
            if (err) {
              console.error("Error fetching role:", err);
              return res.status(500).json({ message: "Server error" });
            }

            if (roleResult.length === 0) {
              return res.status(400).json({ message: "Invalid role" });
            }

            const roleId = roleResult[0].role_id;

            const assignRoleQuery =
              "INSERT INTO userrole (user_id, role_id) VALUES (?, ?)";
            db.query(assignRoleQuery, [userId, roleId], (err) => {
              if (err) {
                console.error("Error assigning role:", err);
                return res.status(500).json({ message: "Server error" });
              }
              res.status(201).json({ message: "User registered successfully" });
            });
          }
        );
      });
    });
  });
};

// User login with JWT
exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  db.query("SELECT * FROM User WHERE email = ?", [email], (err, result) => {
    if (err) {
      console.error("Error during login query:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (result.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = result[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error("Error comparing passwords:", err);
        return res.status(500).json({ message: "Server error" });
      }

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      db.query(
        "SELECT role_name FROM Role INNER JOIN UserRole ON Role.role_id = UserRole.role_id WHERE user_id = ?",
        [user.user_id],
        (err, roleResult) => {
          if (err) {
            console.error("Error fetching role:", err);
            return res.status(500).json({ message: "Server error" });
          }

          const role = roleResult[0]?.role_name || "user";

          const token = jwt.sign(
            { userId: user.user_id, email: user.email, role: role },
            JWT_SECRET,
            { expiresIn: "1h" }
          );

          res.status(200).json({
            message: "Login successful",
            token,
            role,
          });
        }
      );
    });
  });
};
