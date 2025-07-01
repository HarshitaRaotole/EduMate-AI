const express = require("express")
const { query } = require("../config/database")
const { authenticateToken } = require("../middleware/auth")

const router = express.Router()

// Get all subjects for user
router.get("/", authenticateToken, async (req, res) => {
  try {
    const subjects = await query("SELECT * FROM subjects WHERE user_id = ? ORDER BY created_at DESC", [req.user.id])
    res.json({ subjects })
  } catch (error) {
    console.error("Get subjects error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Create new subject
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { name, description, color } = req.body

    if (!name) {
      return res.status(400).json({ error: "Subject name is required" })
    }

    // Removed start_date from the query since it doesn't exist in the table
    const result = await query("INSERT INTO subjects (user_id, name, description, color) VALUES (?, ?, ?, ?)", [
      req.user.id,
      name,
      description || null,
      color || "#3B82F6",
    ])

    const subject = {
      id: result.insertId,
      user_id: req.user.id,
      name,
      description: description || null,
      color: color || "#3B82F6",
      created_at: new Date().toISOString(),
    }

    res.status(201).json({ subject })
  } catch (error) {
    console.error("Create subject error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Update subject
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const subjectId = Number.parseInt(req.params.id)
    const { name, description, color } = req.body

    if (!name) {
      return res.status(400).json({ error: "Subject name is required" })
    }

    // Verify subject belongs to user
    const subjects = await query("SELECT id FROM subjects WHERE id = ? AND user_id = ?", [subjectId, req.user.id])

    if (subjects.length === 0) {
      return res.status(404).json({ error: "Subject not found" })
    }

    await query(
      "UPDATE subjects SET name = ?, description = ?, color = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [name, description || null, color || "#3B82F6", subjectId],
    )

    const updatedSubject = {
      id: subjectId,
      user_id: req.user.id,
      name,
      description: description || null,
      color: color || "#3B82F6",
      updated_at: new Date().toISOString(),
    }

    res.json({ subject: updatedSubject })
  } catch (error) {
    console.error("Update subject error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Delete subject
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const subjectId = Number.parseInt(req.params.id)

    // Verify subject belongs to user
    const subjects = await query("SELECT id FROM subjects WHERE id = ? AND user_id = ?", [subjectId, req.user.id])

    if (subjects.length === 0) {
      return res.status(404).json({ error: "Subject not found" })
    }

    await query("DELETE FROM subjects WHERE id = ?", [subjectId])

    res.json({ message: "Subject deleted successfully" })
  } catch (error) {
    console.error("Delete subject error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

module.exports = router
