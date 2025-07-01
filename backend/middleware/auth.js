const jwt = require("jsonwebtoken")
const { query } = require("../config/database")

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    return res.status(401).json({ error: "Access token required" })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)

    // Verify user still exists
    const users = await query("SELECT id, name, email FROM users WHERE id = ?", [decoded.id])

    if (users.length === 0) {
      return res.status(401).json({ error: "User not found" })
    }

    req.user = users[0]
    next()
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired token" })
  }
}

module.exports = { authenticateToken }
