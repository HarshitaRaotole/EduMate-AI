const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { query } = require("../config/database")
const { authenticateToken } = require("../middleware/auth")

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// Register
router.post("/register", async (req, res) => {
  try {
    console.log("📝 Registration request received:", req.body)

    const { name, email, password } = req.body

    // Validate input
    if (!name || !email || !password) {
      console.log("❌ Missing required fields")
      return res.status(400).json({ error: "All fields are required" })
    }

    if (password.length < 6) {
      console.log("❌ Password too short")
      return res.status(400).json({ error: "Password must be at least 6 characters long" })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.log("❌ Invalid email format")
      return res.status(400).json({ error: "Please enter a valid email address" })
    }

    console.log("🔍 Checking if user exists...")

    // Check if user already exists
    const existingUsers = await query("SELECT id FROM users WHERE email = ?", [email])

    if (existingUsers.length > 0) {
      console.log("❌ User already exists")
      return res.status(400).json({ error: "User already exists with this email" })
    }

    console.log("🔐 Hashing password...")

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    console.log("💾 Creating user in database...")

    // Create user
    const result = await query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [
      name,
      email,
      hashedPassword,
    ])

    const user = {
      id: result.insertId,
      name,
      email,
    }

    console.log("🎫 Generating JWT token...")

    // Generate token
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: "7d" })

    console.log("✅ Registration successful for:", email)

    res.status(201).json({
      message: "User created successfully",
      user,
      token,
    })
  } catch (error) {
    console.error("❌ Register error:", error)
    res.status(500).json({ error: "Internal server error: " + error.message })
  }
})

// Login
router.post("/login", async (req, res) => {
  try {
    console.log("🔑 Login request received:", { email: req.body.email })

    const { email, password } = req.body

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" })
    }

    // Find user
    const users = await query("SELECT * FROM users WHERE email = ?", [email])

    if (users.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const user = users[0]

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    // Generate token
    const userPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
    }

    const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: "7d" })

    console.log("✅ Login successful for:", email)

    res.json({
      message: "Login successful",
      user: userPayload,
      token,
    })
  } catch (error) {
    console.error("❌ Login error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Get current user
router.get("/me", authenticateToken, (req, res) => {
  res.json({ user: req.user })
})

module.exports = router
