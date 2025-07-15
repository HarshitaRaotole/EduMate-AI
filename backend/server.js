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
const reminderRoutes = require("./routes/reminders")
const { authenticateToken } = require("./middleware/auth")

const app = express()
const PORT = process.env.PORT || 5000

// IMPORTANT: Add this line to trust proxy headers for Render
app.set("trust proxy", 1) // '1' means trust the first proxy (Render)

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
app.use("/api/chat", chatRoutes)

// Protected routes (require authentication)
app.use("/api/subjects", authenticateToken, subjectRoutes)
app.use("/api/assignments", authenticateToken, assignmentRoutes)
app.use("/api/dashboard", authenticateToken, dashboardRoutes)
app.use("/api/reminders", authenticateToken, reminderRoutes)

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

module.exports = app

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`)
})
