const db = require("../config/db");

const deleteUser = (req, res) => {
  const { user_id } = req.params;

  // Log incoming request for debugging
  console.log(`Received request to delete user with ID: ${user_id}`);

  // Validate if user_id exists
  if (!user_id) {
    return res.status(400).json({
      success: false,
      message: "User ID is required.",
    });
  }

  // Query to delete the user from the database
  const deleteUserQuery = "DELETE FROM User WHERE user_id = ?";
  db.query(deleteUserQuery, [user_id], (err, results) => {
    if (err) {
      console.error("Error deleting user from database:", err);
      return res.status(500).json({
        success: false,
        message: "Database query error during user deletion.",
      });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Log successful deletion
    console.log(`User with ID ${user_id} deleted successfully.`);

    // Optionally, delete the associated roles or other data if necessary
    const deleteRoleQuery = "DELETE FROM UserRole WHERE user_id = ?";
    db.query(deleteRoleQuery, [user_id], (err) => {
      if (err) {
        console.error("Error removing user roles:", err);
        return res.status(500).json({
          success: false,
          message: "Error removing user roles.",
        });
      }

      res.status(200).json({
        success: true,
        message: "User deleted successfully.",
      });
    });
  });
};

module.exports = { deleteUser };
