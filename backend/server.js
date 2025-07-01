const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")
require("dotenv").config()

const authRoutes = require("./routes/auth")
const subjectRoutes = require("./routes/subjects")
const assignmentRoutes = require("./routes/assignments")
const dashboardRoutes = require("./routes/dashboard")

const app = express()
const PORT = process.env.PORT || 5000

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: false, // Disable for Vercel compatibility
  }),
)

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
  }),
)

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
})
app.use(limiter)

// Body parsing middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/subjects", subjectRoutes)
app.use("/api/assignments", assignmentRoutes)
app.use("/api/dashboard", dashboardRoutes)

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "EduMateAI API is running" })
})

// Root endpoint for Vercel
app.get("/api", (req, res) => {
  res.json({ message: "EduMateAI API", version: "1.0.0" })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: "Something went wrong!" })
})

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" })
})

// Export for Vercel
module.exports = app

// Start server only if not in Vercel environment
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`)
    console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`)
  })
}
