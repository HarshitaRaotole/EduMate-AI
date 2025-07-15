const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")
require("dotenv").config()
const authRoutes = require("./routes/auth")
const subjectRoutes = require("./routes/subjects")
const assignmentRoutes = require("./routes/assignments")
const dashboardRoutes = require("./routes/dashboard")
const chatRoutes = require("./routes/chat")
const reminderRoutes = require("./routes/reminders") // ADDED: Import reminder routes
// NEW: Import your specific authentication middleware
const { authenticateToken } = require("./middleware/auth") // Adjust path if your auth.js is elsewhere

const app = express()
const PORT = process.env.PORT || 5000 // Use Render's PORT, or fallback to 5000 for local development

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: false,
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
  windowMs: 15 * 60 * 1000,
  max: 100,
})
app.use(limiter)

// Body parsing middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Public routes (no authentication needed)
app.use("/api/auth", authRoutes)
app.use("/api/chat", chatRoutes) // Chat might be public or have its own auth logic

// Protected routes (require authentication)
// Apply YOUR authenticateToken middleware to routes that need user context (req.user.id)
app.use("/api/subjects", authenticateToken, subjectRoutes)
app.use("/api/assignments", authenticateToken, assignmentRoutes)
app.use("/api/dashboard", authenticateToken, dashboardRoutes)
app.use("/api/reminders", authenticateToken, reminderRoutes) // ADDED: Apply YOUR middleware here

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

// Export for Vercel (keep this for potential Vercel deployments later)
module.exports = app

// Start server for Render (remove the 'if' condition)
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`)
})
