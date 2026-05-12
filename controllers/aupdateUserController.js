const db = require("../config/db");

const updateUser = (req, res) => {
  const { username, password, email, role_id } = req.body;
  const { user_id } = req.params;

  // Validate inputs (similar to createUser)
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid email format." });
  }

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      success: false,
      message:
        "Password must be at least 6 characters long, contain one uppercase letter, one lowercase letter, and one special character.",
    });
  }

  // Update user details in the database
  const updateQuery =
    "UPDATE User SET username = ?, password = ?, email = ? WHERE user_id = ?";
  db.query(
    updateQuery,
    [username, password, email, user_id],
    (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ success: false, message: "Database query error." });
      }

      // Update user role
      const updateRoleQuery =
        "UPDATE UserRole SET role_id = ? WHERE user_id = ?";
      db.query(updateRoleQuery, [role_id, user_id], (err, results) => {
        if (err) {
          return res
            .status(500)
            .json({ success: false, message: "Error updating role." });
        }

        res
          .status(200)
          .json({ success: true, message: "User updated successfully." });
      });
    }
  );
};

module.exports = { updateUser };
