const express = require("express")
const { query } = require("../config/database")
const { authenticateToken } = require("../middleware/auth")

const router = express.Router()

// Get all assignments for user with subject information
router.get("/", authenticateToken, async (req, res) => {
  try {
    const assignments = await query(
      `
      SELECT 
        a.*,
        s.name as subject_name,
        s.color as subject_color
      FROM assignments a
      LEFT JOIN subjects s ON a.subject_id = s.id
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

// Get single assignment
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const assignmentId = Number.parseInt(req.params.id)
    const assignments = await query(
      `
      SELECT 
        a.*,
        s.name as subject_name,
        s.color as subject_color
      FROM assignments a
      LEFT JOIN subjects s ON a.subject_id = s.id
      WHERE a.id = ? AND a.user_id = ?
    `,
      [assignmentId, req.user.id],
    )

    if (assignments.length === 0) {
      return res.status(404).json({ error: "Assignment not found" })
    }

    res.json({ assignment: assignments[0] })
  } catch (error) {
    console.error("Get assignment error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Create new assignment
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { title, description, subject_id, deadline, priority, status } = req.body

    // Validate required fields
    if (!title || !deadline) {
      return res.status(400).json({ error: "Title and deadline are required" })
    }

    // Verify subject belongs to user if subject_id is provided
    if (subject_id) {
      const subjects = await query("SELECT id FROM subjects WHERE id = ? AND user_id = ?", [subject_id, req.user.id])
      if (subjects.length === 0) {
        return res.status(400).json({ error: "Invalid subject" })
      }
    }

    // Convert undefined values to null for MySQL
    const safeValues = {
      title: title || null,
      description: description || null,
      subject_id: subject_id || null,
      deadline: deadline || null,
      priority: priority || "medium",
      status: status || "pending",
    }

    const result = await query(
      "INSERT INTO assignments (user_id, title, description, subject_id, deadline, priority, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        req.user.id,
        safeValues.title,
        safeValues.description,
        safeValues.subject_id,
        safeValues.deadline,
        safeValues.priority,
        safeValues.status,
      ],
    )

    // Get the created assignment with subject info
    const createdAssignments = await query(
      `
      SELECT 
        a.*,
        s.name as subject_name,
        s.color as subject_color
      FROM assignments a
      LEFT JOIN subjects s ON a.subject_id = s.id
      WHERE a.id = ?
    `,
      [result.insertId],
    )

    res.status(201).json({ assignment: createdAssignments[0] })
  } catch (error) {
    console.error("Create assignment error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Update assignment
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const assignmentId = Number.parseInt(req.params.id)
    const { title, description, subject_id, deadline, priority, status } = req.body

    // Verify assignment belongs to user
    const assignments = await query("SELECT id FROM assignments WHERE id = ? AND user_id = ?", [
      assignmentId,
      req.user.id,
    ])

    if (assignments.length === 0) {
      return res.status(404).json({ error: "Assignment not found" })
    }

    // Verify subject belongs to user if subject_id is provided
    if (subject_id !== undefined && subject_id !== null) {
      const subjects = await query("SELECT id FROM subjects WHERE id = ? AND user_id = ?", [subject_id, req.user.id])
      if (subjects.length === 0) {
        return res.status(400).json({ error: "Invalid subject" })
      }
    }

    // Convert undefined values to null for MySQL and build dynamic update
    const updateFields = []
    const updateValues = []

    if (title !== undefined) {
      updateFields.push("title = ?")
      updateValues.push(title || null)
    }
    if (description !== undefined) {
      updateFields.push("description = ?")
      updateValues.push(description || null)
    }
    if (subject_id !== undefined) {
      updateFields.push("subject_id = ?")
      updateValues.push(subject_id || null)
    }
    if (deadline !== undefined) {
      updateFields.push("deadline = ?")
      updateValues.push(deadline || null)
    }
    if (priority !== undefined) {
      updateFields.push("priority = ?")
      updateValues.push(priority || "medium")
    }
    if (status !== undefined) {
      updateFields.push("status = ?")
      updateValues.push(status || "pending")
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: "No valid fields to update" })
    }

    // Add updated_at timestamp and assignment ID
    updateFields.push("updated_at = CURRENT_TIMESTAMP")
    updateValues.push(assignmentId)

    const updateQuery = `UPDATE assignments SET ${updateFields.join(", ")} WHERE id = ?`

    await query(updateQuery, updateValues)

    // Get updated assignment with subject info
    const updatedAssignments = await query(
      `
      SELECT 
        a.*,
        s.name as subject_name,
        s.color as subject_color
      FROM assignments a
      LEFT JOIN subjects s ON a.subject_id = s.id
      WHERE a.id = ?
    `,
      [assignmentId],
    )

    res.json({ assignment: updatedAssignments[0] })
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

// Get assignments by subject
router.get("/subject/:subjectId", authenticateToken, async (req, res) => {
  try {
    const subjectId = Number.parseInt(req.params.subjectId)
    const assignments = await query(
      `
      SELECT 
        a.*,
        s.name as subject_name,
        s.color as subject_color
      FROM assignments a
      LEFT JOIN subjects s ON a.subject_id = s.id
      WHERE a.subject_id = ? AND a.user_id = ?
      ORDER BY a.deadline ASC
    `,
      [subjectId, req.user.id],
    )
    res.json({ assignments })
  } catch (error) {
    console.error("Get assignments by subject error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Get assignments by status
router.get("/status/:status", authenticateToken, async (req, res) => {
  try {
    const status = req.params.status
    const assignments = await query(
      `
      SELECT 
        a.*,
        s.name as subject_name,
        s.color as subject_color
      FROM assignments a
      LEFT JOIN subjects s ON a.subject_id = s.id
      WHERE a.status = ? AND a.user_id = ?
      ORDER BY a.deadline ASC
    `,
      [status, req.user.id],
    )
    res.json({ assignments })
  } catch (error) {
    console.error("Get assignments by status error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

module.exports = router
