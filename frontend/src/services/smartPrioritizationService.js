// Smart Task Prioritization Service
// AI that recommends which task to do first based on time and priority

export class SmartPrioritizationService {
  constructor() {
    this.weights = {
      deadline: 0.7, // How close the deadline is (most important)
      priority: 0.3, // User-set priority (high/medium/low)
    }
  }

  /**
   * Calculate which task should be done first
   * Returns a simple priority score based on deadline urgency and user priority
   */
  calculateTaskPriority(assignment) {
    // Safely handle potential null/undefined values
    const safeAssignment = {
      deadline: assignment?.deadline || new Date(),
      priority: assignment?.priority || "medium",
      title: assignment?.title || "Untitled Task",
      ...assignment,
    }

    const deadlineScore = this.calculateDeadlineUrgency(safeAssignment.deadline)
    const priorityScore = this.calculatePriorityLevel(safeAssignment.priority)

    // Calculate weighted total score
    const totalScore = deadlineScore * this.weights.deadline + priorityScore * this.weights.priority

    return {
      score: Math.round(totalScore * 100) / 100,
      urgency: this.getUrgencyLevel(totalScore),
      recommendation: this.getSimpleRecommendation(safeAssignment, totalScore),
      daysUntilDeadline: this.getDaysUntilDeadline(safeAssignment.deadline),
    }
  }

  /**
   * Calculate deadline urgency (0-10)
   * Closer deadlines get higher scores
   */
  calculateDeadlineUrgency(deadline) {
    try {
      const now = new Date()
      const deadlineDate = new Date(deadline)

      if (isNaN(deadlineDate.getTime())) {
        return 5 // Default score for invalid dates
      }

      const daysUntil = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24))

      if (daysUntil < 0) return 10 // Overdue
      if (daysUntil === 0) return 9.5 // Due today
      if (daysUntil === 1) return 9 // Due tomorrow
      if (daysUntil <= 3) return 8 // Due within 3 days
      if (daysUntil <= 7) return 6 // Due within a week
      if (daysUntil <= 14) return 4 // Due within 2 weeks
      return 2 // More than 2 weeks away
    } catch (error) {
      return 5 // Default score on error
    }
  }

  /**
   * Calculate priority level score (0-10)
   */
  calculatePriorityLevel(priority) {
    const priorityStr = priority ? String(priority).toLowerCase() : "medium"

    const priorityMap = {
      high: 10,
      medium: 6,
      low: 3,
    }
    return priorityMap[priorityStr] || 6
  }

  /**
   * Get urgency level based on total score
   */
  getUrgencyLevel(score) {
    if (score >= 8.5) return "critical"
    if (score >= 7) return "high"
    if (score >= 5) return "medium"
    return "low"
  }

  /**
   * Get days until deadline
   */
  getDaysUntilDeadline(deadline) {
    try {
      const now = new Date()
      const deadlineDate = new Date(deadline)
      if (isNaN(deadlineDate.getTime())) return null
      return Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24))
    } catch (error) {
      return null
    }
  }

  /**
   * Get simple AI recommendation
   */
  getSimpleRecommendation(assignment, score) {
    try {
      const daysUntil = this.getDaysUntilDeadline(assignment.deadline)

      if (score >= 9) {
        if (daysUntil < 0) return "⚠️ OVERDUE - Do this immediately!"
        if (daysUntil === 0) return "🔥 Due TODAY - Start now!"
        if (daysUntil === 1) return "⚡ Due TOMORROW - Priority #1"
        return "🚨 HIGH PRIORITY - Do this first"
      }

      if (score >= 7) {
        return "📅 Important - Do this next"
      }

      if (score >= 5) {
        return "📝 Moderate priority - Plan for this week"
      }

      return "⏰ Low priority - Can wait"
    } catch (error) {
      return "📝 Review this task"
    }
  }

  /**
   * Sort assignments by priority - which to do first
   * Returns assignments ordered by what should be done first
   */
  getTaskOrder(assignments) {
    if (!Array.isArray(assignments) || assignments.length === 0) {
      return []
    }

    try {
      // Only include pending and in-progress tasks
      const activeTasks = assignments.filter((a) => a?.status !== "submitted")

      const tasksWithPriority = activeTasks
        .map((assignment) => {
          if (!assignment) return null

          return {
            ...assignment,
            aiPriority: this.calculateTaskPriority(assignment),
          }
        })
        .filter(Boolean)

      // Sort by priority score (highest first) then by deadline (closest first)
      return tasksWithPriority.sort((a, b) => {
        const scoreDiff = b.aiPriority.score - a.aiPriority.score
        if (Math.abs(scoreDiff) < 0.1) {
          // If scores are very close, prioritize by deadline
          const dateA = new Date(a.deadline)
          const dateB = new Date(b.deadline)
          if (isNaN(dateA.getTime()) && isNaN(dateB.getTime())) return 0
          if (isNaN(dateA.getTime())) return 1
          if (isNaN(dateB.getTime())) return -1
          return dateA - dateB
        }
        return scoreDiff
      })
    } catch (error) {
      console.error("Error ordering tasks:", error)
      return assignments
    }
  }

  /**
   * Get the next task to work on (the most important one)
   */
  getNextTask(assignments) {
    const orderedTasks = this.getTaskOrder(assignments)
    return orderedTasks.length > 0 ? orderedTasks[0] : null
  }

  /**
   * Get top 3 tasks to focus on today
   */
  getTodaysFocus(assignments, maxTasks = 3) {
    const orderedTasks = this.getTaskOrder(assignments)
    return orderedTasks.slice(0, maxTasks)
  }
}

// Export singleton instance
export const smartPrioritization = new SmartPrioritizationService()

// Export utility functions
export const getTaskOrder = (assignments) => smartPrioritization.getTaskOrder(assignments)
export const getNextTask = (assignments) => smartPrioritization.getNextTask(assignments)
export const getTodaysFocus = (assignments, maxTasks) => smartPrioritization.getTodaysFocus(assignments, maxTasks)
