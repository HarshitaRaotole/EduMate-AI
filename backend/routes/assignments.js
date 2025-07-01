const express = require("express")
const { query } = require("../config/database")
const { authenticateToken } = require("../middleware/auth")

const router = express.Router()

// Get all assignments for user
router.get("/", authenticateToken, async (req, res) => {
  try {
    const assignments = await query(
      `
      SELECT a.*, s.name as subject_name, s.color as subject_color
      FROM assignments a
      JOIN subjects s ON a.subject_id = s.id
      WHERE a.user_id = ?
      ORDER BY a.deadline ASC
    `,
      [req.user.id],
    )

    res.json({ assignments })
  } catch (error) {
    console.error("Get assignments error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Create new assignment
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { title, description, deadline, priority, status, subject_id } = req.body

    if (!title || !deadline || !subject_id) {
      return res.status(400).json({ error: "Title, deadline, and subject are required" })
    }

    // Verify subject belongs to user
    const subjects = await query("SELECT id FROM subjects WHERE id = ? AND user_id = ?", [subject_id, req.user.id])

    if (subjects.length === 0) {
      return res.status(400).json({ error: "Invalid subject" })
    }

    const result = await query(
      `
      INSERT INTO assignments (user_id, subject_id, title, description, deadline, priority, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
      [req.user.id, subject_id, title, description || null, deadline, priority || "medium", status || "pending"],
    )

    const assignment = {
      id: result.insertId,
      user_id: req.user.id,
      subject_id,
      title,
      description: description || null,
      deadline,
      priority: priority || "medium",
      status: status || "pending",
    }

    res.status(201).json({ assignment })
  } catch (error) {
    console.error("Create assignment error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Update assignment
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const assignmentId = Number.parseInt(req.params.id)
    const { title, description, deadline, priority, status, subject_id } = req.body

    // Verify assignment belongs to user
    const assignments = await query("SELECT id FROM assignments WHERE id = ? AND user_id = ?", [
      assignmentId,
      req.user.id,
    ])

    if (assignments.length === 0) {
      return res.status(404).json({ error: "Assignment not found" })
    }

    // Verify subject belongs to user if subject_id is provided
    if (subject_id) {
      const subjects = await query("SELECT id FROM subjects WHERE id = ? AND user_id = ?", [subject_id, req.user.id])

      if (subjects.length === 0) {
        return res.status(400).json({ error: "Invalid subject" })
      }
    }

    await query(
      `
      UPDATE assignments 
      SET title = ?, description = ?, deadline = ?, priority = ?, status = ?, subject_id = ?
      WHERE id = ?
    `,
      [title, description, deadline, priority, status, subject_id, assignmentId],
    )

    res.json({ message: "Assignment updated successfully" })
  } catch (error) {
    console.error("Update assignment error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Delete assignment
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const assignmentId = Number.parseInt(req.params.id)

    // Verify assignment belongs to user
    const assignments = await query("SELECT id FROM assignments WHERE id = ? AND user_id = ?", [
      assignmentId,
      req.user.id,
    ])

    if (assignments.length === 0) {
      return res.status(404).json({ error: "Assignment not found" })
    }

    await query("DELETE FROM assignments WHERE id = ?", [assignmentId])

    res.json({ message: "Assignment deleted successfully" })
  } catch (error) {
    console.error("Delete assignment error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

module.exports = router
