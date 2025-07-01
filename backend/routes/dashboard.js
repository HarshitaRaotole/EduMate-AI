const express = require("express")
const { query } = require("../config/database")
const { authenticateToken } = require("../middleware/auth")

const router = express.Router()

// Get dashboard statistics
router.get("/stats", authenticateToken, async (req, res) => {
  try {
    // Get assignment stats
    const assignmentStats = await query(
      `
      SELECT 
        status,
        COUNT(*) as count
      FROM assignments 
      WHERE user_id = ?
      GROUP BY status
    `,
      [req.user.id],
    )

    // Get subject count
    const subjectCount = await query("SELECT COUNT(*) as count FROM subjects WHERE user_id = ?", [req.user.id])

    // Get upcoming assignments (next 7 days)
    const upcomingAssignments = await query(
      `
      SELECT COUNT(*) as count
      FROM assignments 
      WHERE user_id = ? 
      AND deadline BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)
      AND status != 'submitted'
    `,
      [req.user.id],
    )

    // Get overdue assignments
    const overdueAssignments = await query(
      `
      SELECT COUNT(*) as count
      FROM assignments 
      WHERE user_id = ? 
      AND deadline < CURDATE()
      AND status != 'submitted'
    `,
      [req.user.id],
    )

    const stats = {
      subjects: subjectCount[0]?.count || 0,
      assignments: {
        pending: assignmentStats.find((s) => s.status === "pending")?.count || 0,
        in_progress: assignmentStats.find((s) => s.status === "in_progress")?.count || 0,
        submitted: assignmentStats.find((s) => s.status === "submitted")?.count || 0,
      },
      upcoming: upcomingAssignments[0]?.count || 0,
      overdue: overdueAssignments[0]?.count || 0,
    }

    res.json({ stats })
  } catch (error) {
    console.error("Get dashboard stats error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

module.exports = router
