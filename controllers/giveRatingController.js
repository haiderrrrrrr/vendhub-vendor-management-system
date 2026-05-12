const db = require("../config/db"); 

// Function to handle performance evaluation submission
const submitPerformanceEvaluation = (req, res) => {
  const { vendor_id, evaluator_id, rating, feedback, improvement_notes } =
    req.body;

  // Validate input fields
  if (
    !vendor_id ||
    !evaluator_id ||
    !rating ||
    !feedback ||
    !improvement_notes
  ) {
    return res.status(400).json({
      success: false,
      message: "All fields are required.",
    });
  }

  // Query to call the stored procedure AddPerformanceEvaluation
  const query = `
    CALL AddPerformanceEvaluation(?, ?, ?, ?, ?);
  `;

  // Execute the query with the parameters
  db.query(
    query,
    [vendor_id, evaluator_id, rating, feedback, improvement_notes],
    (err) => {
      if (err) {
        console.error("Error executing stored procedure:", err);
        return res.status(500).json({
          success: false,
          message: "Error submitting performance evaluation.",
        });
      }

      res.status(200).json({
        success: true,
        message: "Performance evaluation submitted successfully.",
      });
    }
  );
};

module.exports = { submitPerformanceEvaluation };
