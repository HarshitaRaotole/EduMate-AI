"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import {
  BookOpen,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Circle,
  PlayCircle,
  TrendingUp,
  Star,
  Target,
  Clock,
} from "lucide-react"
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js"
import { Doughnut } from "react-chartjs-2"
import api from "../utils/api"
import LoadingSpinner from "../components/LoadingSpinner"

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, assignmentsResponse] = await Promise.all([
        api.get("/dashboard/stats"),
        api.get("/assignments"),
      ])

      setStats(statsResponse.data.stats)
      setAssignments(assignmentsResponse.data.assignments.slice(0, 5))
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "submitted":
        return <CheckCircle className="h-5 w-5 text-emerald-600" />
      case "in_progress":
        return <PlayCircle className="h-5 w-5 text-blue-600" />
      case "pending":
        return <Clock className="h-5 w-5 text-red-600" />
      default:
        return <Circle className="h-5 w-5 text-red-600" />
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-gradient-to-r from-red-500 to-red-600"
      case "medium":
        return "bg-gradient-to-r from-amber-500 to-orange-500"
      case "low":
        return "bg-gradient-to-r from-emerald-500 to-green-500"
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600"
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const isOverdue = (deadline) => {
    return new Date(deadline) < new Date() && new Date(deadline).toDateString() !== new Date().toDateString()
  }

  if (loading) {
    return <LoadingSpinner />
  }

  const totalAssignments = stats
    ? stats.assignments.pending + stats.assignments.in_progress + stats.assignments.submitted
    : 0
  const completionRate = totalAssignments > 0 ? (stats.assignments.submitted / totalAssignments) * 100 : 0

  // Updated Chart data with red for pending
  const assignmentStatusData = {
    labels: ["Pending", "In Progress", "Submitted"],
    datasets: [
      {
        data: [stats?.assignments.pending || 0, stats?.assignments.in_progress || 0, stats?.assignments.submitted || 0],
        backgroundColor: ["#EF4444", "#3B82F6", "#10B981"], // Changed first color from gray to red
        borderWidth: 0,
        hoverBackgroundColor: ["#DC2626", "#2563EB", "#059669"],
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
            weight: "500",
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "white",
        bodyColor: "white",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
      },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="space-y-8 p-6">
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Dashboard
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600">
            Welcome back <span className="font-semibold text-blue-600">{user?.name}</span>! Here's an overview of your
            academic progress.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4">
          {/* Total Subjects Card */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium mb-1">Total Subjects</p>
                <p className="text-3xl font-bold">{stats?.subjects || 0}</p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          {/* Upcoming Card */}
          <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-medium mb-1">Upcoming</p>
                <p className="text-3xl font-bold">{stats?.upcoming || 0}</p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Calendar className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          {/* Overdue Card */}
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium mb-1">Overdue</p>
                <p className="text-3xl font-bold">{stats?.overdue || 0}</p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <AlertTriangle className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          {/* Completion Rate Card */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium mb-1">Completion Rate</p>
                <p className="text-3xl font-bold">{Math.round(completionRate)}%</p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Recent Assignments */}
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
          {/* Assignment Status Chart */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-100">
            <div className="flex items-center mb-4 sm:mb-6">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg mr-3">
                <Target className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">Assignment Status</h3>
            </div>
            <div className="h-64 sm:h-72">
              <Doughnut data={assignmentStatusData} options={chartOptions} />
            </div>
          </div>

          {/* Recent Assignments */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-100">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center">
                <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg mr-3">
                  <Star className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800">Recent Assignments</h3>
              </div>
              <Link
                to="/dashboard/assignments"
                className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-semibold hover:underline transition-colors"
              >
                View all →
              </Link>
            </div>
            <div className="space-y-4">
              {assignments.length > 0 ? (
                assignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className={`flex items-center space-x-4 p-4 rounded-xl border-l-4 transition-all duration-200 hover:shadow-md ${
                      isOverdue(assignment.deadline) && assignment.status !== "submitted"
                        ? "bg-red-50 border-red-400 hover:bg-red-100"
                        : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex-shrink-0">{getStatusIcon(assignment.status)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{assignment.title}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <div
                          className="w-3 h-3 rounded-full shadow-sm"
                          style={{ backgroundColor: assignment.subject_color }}
                        />
                        <span className="text-xs text-gray-600 font-medium">{assignment.subject_name}</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full shadow-sm ${getPriorityColor(assignment.priority)}`} />
                        <span
                          className={`text-xs font-medium ${
                            isOverdue(assignment.deadline) && assignment.status !== "submitted"
                              ? "text-red-600"
                              : "text-gray-600"
                          }`}
                        >
                          {formatDate(assignment.deadline)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <Calendar className="h-10 w-10 text-blue-600" />
                  </div>
                  <p className="text-gray-600 mb-4 font-medium">No assignments yet</p>
                  <Link
                    to="/dashboard/assignments"
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Create your first assignment
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg mr-3">
              <Star className="h-6 w-6 text-white" />
            </div>
            Quick Actions
          </h3>
          <div className="grid gap-6 md:grid-cols-2">
            <Link
              to="/dashboard/subjects"
              className="group flex items-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300 border border-blue-200 hover:border-blue-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-200">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-lg">Manage Subjects</p>
                <p className="text-sm text-blue-700 font-medium">Add or organize your subjects</p>
              </div>
            </Link>
            <Link
              to="/dashboard/assignments"
              className="group flex items-center p-6 bg-gradient-to-br from-emerald-50 to-green-100 rounded-xl hover:from-emerald-100 hover:to-green-200 transition-all duration-300 border border-emerald-200 hover:border-emerald-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <div className="p-3 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-200">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-lg">Track Assignments</p>
                <p className="text-sm text-emerald-700 font-medium">Add new assignments and deadlines</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
