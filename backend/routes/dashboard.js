const express = require("express")
const { query } = require("../config/database")
const { authenticateToken } = require("../middleware/auth")

const router = express.Router()

// Get dashboard statistics
router.get("/stats", authenticateToken, async (req, res) => {
  try {
    // Get assignment stats by status
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

    // Get total assignments count
    const totalAssignments = await query("SELECT COUNT(*) as count FROM assignments WHERE user_id = ?", [req.user.id])

    // Get upcoming assignments (next 7 days, excluding today and not submitted)
    const upcomingAssignments = await query(
      `
      SELECT COUNT(*) as count
      FROM assignments 
      WHERE user_id = ? 
      AND DATE(deadline) > CURDATE()
      AND DATE(deadline) <= DATE_ADD(CURDATE(), INTERVAL 7 DAY)
      AND status != 'submitted'
    `,
      [req.user.id],
    )

    // Get due assignments - ALL assignments that are not completed (regardless of deadline)
    const dueAssignments = await query(
      `
      SELECT COUNT(*) as count
      FROM assignments 
      WHERE user_id = ? 
      AND status != 'submitted'
    `,
      [req.user.id],
    )

    // Get overdue assignments (past deadline and not submitted) - for additional tracking
    const overdueAssignments = await query(
      `
      SELECT COUNT(*) as count
      FROM assignments 
      WHERE user_id = ? 
      AND DATE(deadline) < CURDATE()
      AND status != 'submitted'
    `,
      [req.user.id],
    )

    // Get completed assignments
    const completedAssignments = await query(
      `
      SELECT COUNT(*) as count
      FROM assignments 
      WHERE user_id = ? 
      AND status = 'submitted'
    `,
      [req.user.id],
    )

    // Calculate completion rate
    const totalCount = totalAssignments[0]?.count || 0
    const completedCount = completedAssignments[0]?.count || 0
    const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

    const stats = {
      subjects: subjectCount[0]?.count || 0,
      assignments: {
        pending: assignmentStats.find((s) => s.status === "pending")?.count || 0,
        in_progress: assignmentStats.find((s) => s.status === "in_progress")?.count || 0,
        submitted: completedCount,
      },
      total_assignments: totalCount,
      upcoming: upcomingAssignments[0]?.count || 0,
      overdue: overdueAssignments[0]?.count || 0,
      due_assignments: dueAssignments[0]?.count || 0,
      completed_assignments: completedCount,
      completion_rate: completionRate,
    }

    res.json({ stats })
  } catch (error) {
    console.error("Get dashboard stats error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

module.exports = router
