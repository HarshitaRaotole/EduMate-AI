"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Star, ArrowRight, AlertTriangle, Clock, Check } from "lucide-react"
import { smartPrioritization } from "../services/smartPrioritizationService"
import api from "../utils/api"

const SmartPriorityDashboard = ({ assignments = [], className = "", onTaskComplete }) => {
  const [todaysFocus, setTodaysFocus] = useState([])
  const [completingTasks, setCompletingTasks] = useState(new Set())

  useEffect(() => {
    if (assignments.length > 0) {
      const focus = smartPrioritization.getTodaysFocus(assignments, 5)
      setTodaysFocus(focus)
    }
  }, [assignments])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  const getDeadlineText = (assignment) => {
    if (!assignment.aiPriority.daysUntilDeadline) return "Check deadline"

    const days = assignment.aiPriority.daysUntilDeadline

    if (days < 0) {
      const overdueDays = Math.abs(days)
      if (overdueDays === 1) return "⚠️ Do it first! (1 day overdue)"
      return `⚠️ Do it first! (${overdueDays} days overdue)`
    }
    if (days === 0) return "🔥 Due Today - Do it now!"
    if (days === 1) return "⚡ Due Tomorrow"
    return `${days} days left`
  }

  const getUrgencyIcon = (assignment) => {
    if (!assignment.aiPriority.daysUntilDeadline) return <Clock className="h-4 w-4" />

    const days = assignment.aiPriority.daysUntilDeadline
    if (days < 0) return <AlertTriangle className="h-4 w-4 text-red-500" />
    if (days === 0) return <AlertTriangle className="h-4 w-4 text-orange-500" />
    return <Clock className="h-4 w-4" />
  }

  const handleCompleteTask = async (assignmentId) => {
    setCompletingTasks((prev) => new Set([...prev, assignmentId]))

    try {
      // Update assignment status to submitted
      await api.put(`/assignments/${assignmentId}`, {
        status: "submitted",
      })

      // Show success animation for 1 second
      setTimeout(() => {
        // Remove from today's focus list immediately
        setTodaysFocus((prev) => prev.filter((task) => task.id !== assignmentId))

        // Remove from completing state
        setCompletingTasks((prev) => {
          const newSet = new Set(prev)
          newSet.delete(assignmentId)
          return newSet
        })

        // Call parent callback to refresh dashboard data
        if (onTaskComplete) {
          onTaskComplete()
        }
      }, 1000)
    } catch (error) {
      console.error("Error completing task:", error)
      setCompletingTasks((prev) => {
        const newSet = new Set(prev)
        newSet.delete(assignmentId)
        return newSet
      })
    }
  }

  if (assignments.length === 0) {
    return (
      <div
        className={`bg-gradient-to-r from-blue-500 to-white rounded-2xl p-6 shadow-lg border border-blue-200 ${className}`}
      >
        <div className="text-center py-6">
          <div className="p-3 bg-blue-600 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
            <Star className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Today's Task Order Ready</h3>
          <p className="text-blue-100 mb-4">Add assignments to see which task you should do first!</p>
          <Link
            to="/dashboard/assignments"
            className="inline-flex items-center px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
          >
            Add Assignments <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Today's Task Order - Blue to White Gradient */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center mb-4">
          <div className="p-2 bg-slate-600 rounded-lg mr-3 shadow-sm">
            <Star className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800">Today's Task Order</h3>
        </div>

        <div className="space-y-3">
          {todaysFocus.map((assignment, index) => {
            const isCompleting = completingTasks.has(assignment.id)

            return (
              <div
                key={assignment.id}
                className={`flex items-center p-4 rounded-xl border-l-4 transition-all duration-500 ${
                  isCompleting
                    ? "bg-green-100 border-green-500 opacity-75 scale-95"
                    : index === 0
                      ? "bg-white border-slate-600 shadow-md"
                      : index === 1
                        ? "bg-white border-slate-500"
                        : index === 2
                          ? "bg-white border-slate-400"
                          : "bg-white border-slate-300"
                }`}
              >
                <div className="flex items-center mr-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm transition-all duration-300 ${
                      isCompleting
                        ? "bg-green-500"
                        : index === 0
                          ? "bg-blue-600"
                          : index === 1
                            ? "bg-blue-500"
                            : index === 2
                              ? "bg-blue-400"
                              : "bg-blue-300"
                    }`}
                  >
                    {isCompleting ? <Check className="h-4 w-4" /> : index + 1}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h4
                    className={`font-semibold mb-1 transition-all duration-300 ${
                      isCompleting ? "text-green-700 line-through" : "text-gray-900"
                    }`}
                  >
                    {assignment.title}
                  </h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: assignment.subject_color }}
                      />
                      {assignment.subject_name}
                    </span>
                    <span>Due: {formatDate(assignment.deadline)}</span>
                    <span className="flex items-center font-medium">
                      {getUrgencyIcon(assignment)}
                      <span className="ml-1">{getDeadlineText(assignment)}</span>
                    </span>
                  </div>
                </div>

                {/* Complete Task Button */}
                <button
                  onClick={() => handleCompleteTask(assignment.id)}
                  disabled={isCompleting}
                  className={`ml-4 p-2 rounded-full transition-all duration-300 ${
                    isCompleting
                      ? "bg-green-500 text-white scale-110"
                      : "bg-blue-100 text-blue-600 hover:bg-blue-200 hover:scale-110"
                  }`}
                  title={isCompleting ? "Completing..." : "Mark as complete"}
                >
                  <Check className={`h-4 w-4 ${isCompleting ? "animate-pulse" : ""}`} />
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default SmartPriorityDashboard
