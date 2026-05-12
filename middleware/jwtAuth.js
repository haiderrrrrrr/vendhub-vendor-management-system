const jwt = require("jsonwebtoken");

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attaching user info to request
    next(); // Proceeding to the route handler
  } catch (error) {
    console.error("Invalid token:", error);
    return res.status(400).json({ message: "Invalid token" });
  }
};
