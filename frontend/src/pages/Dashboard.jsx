"use client"
import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import MotivationalQuote from "../components/MotivationalQuote"
import AIChatAssistant from "../components/AIChatAssistant" // Import AIChatAssistant
// REMOVED: import SmartReminders from "../components/SmartReminders"
import { BookOpen, Calendar, Clock, CheckCircle, TrendingUp } from "lucide-react"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"
import { Doughnut } from "react-chartjs-2"
import api from "../utils/api"
import LoadingSpinner from "../components/LoadingSpinner"
import SmartPriorityDashboard from "../components/SmartPriorityDashboard"
ChartJS.register(ArcElement, Tooltip, Legend)
const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
  }
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
  const handleTaskComplete = () => {
    // Refresh dashboard data when a task is completed
    fetchDashboardData()
  }
  if (loading) {
    return <LoadingSpinner />
  }
  // Use backend calculated stats
  const totalAssignments = stats?.total_assignments || 0
  const dueAssignments = stats?.due_assignments || 0
  const completedAssignments = stats?.completed_assignments || 0
  const completionRate = stats?.completion_rate || 0
  // Simplified Chart data with dark colors
  const assignmentStatusData = {
    labels: ["Pending", "In Progress", "Submitted"],
    datasets: [
      {
        data: [stats?.assignments?.pending || 0, stats?.assignments?.in_progress || 0, completedAssignments],
        backgroundColor: [
          "#DC2626", // Dark red for pending
          "#2563EB", // Dark blue for in progress
          "#16A34A", // Dark green for submitted
        ],
        borderColor: ["#DC2626", "#2563EB", "#16A34A"],
        borderWidth: 2,
        cutout: "65%",
        borderRadius: 4,
        spacing: 1,
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
          pointStyle: "circle",
          font: {
            size: 14,
            weight: "600",
          },
          color: "#374151",
        },
      },
      tooltip: {
        backgroundColor: "rgba(17, 24, 39, 0.9)",
        titleColor: "white",
        bodyColor: "white",
        borderColor: "rgba(156, 163, 175, 0.3)",
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: (context) => {
            const label = context.label || ""
            const value = context.parsed
            return `${label}: ${value} tasks`
          },
        },
      },
    },
    layout: {
      padding: 10,
    },
    cutout: "50%", // Reduce the cutout to make it less hollow
  }
  return (
    <div className="min-h-screen">
      <div className="space-y-6 p-6">
        {/* Enhanced Welcome Header - Matching UI Theme */}
        <div className="bg-slate-100 border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/30 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="relative text-center">
            <h1 className="text-2xl font-bold text-slate-800 mb-2">
              {getGreeting()}, {user?.name}! 👋
            </h1>
            <p className="text-slate-600 leading-relaxed font-medium">
              Ready to tackle your academic goals today? Here's your progress overview.
            </p>
            {/* AI Assistant Highlight */}
            <div className="mt-4 inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-sm font-medium text-blue-800">
              <span className="mr-2">🤖</span>
              Need help? Ask EduMate AI using the chat button below!
            </div>
          </div>
        </div>
        {/* Motivational Quote - Smaller with Blue-White Gradient */}
        <MotivationalQuote context="time-based" />
        {/* Smart Priority Dashboard - Smaller with Blue-White Gradient */}
        <SmartPriorityDashboard assignments={assignments} onTaskComplete={handleTaskComplete} />
        {/* REMOVED: Smart Reminders Section */}
        {/* <SmartReminders /> */}
        {/* Smaller Stats Cards */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {/* Total Subjects Card */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-xs font-semibold mb-1">Total Subjects</p>
                <p className="text-3xl font-bold">{stats?.subjects || 0}</p>
              </div>
              <div className="p-3 bg-white/25 rounded-xl">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
          {/* Total Assignments Card */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs font-semibold mb-1">Total Assignments</p>
                <p className="text-3xl font-bold">{totalAssignments}</p>
              </div>
              <div className="p-3 bg-white/25 rounded-xl">
                <Calendar className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
          {/* Due Assignments Card */}
          <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-xs font-semibold mb-1">Due Assignments</p>
                <p className="text-3xl font-bold">{dueAssignments}</p>
                <p className="text-orange-200 text-xs mt-1">{dueAssignments > 0 ? "Need completion" : "All done!"}</p>
              </div>
              <div className="p-3 bg-white/25 rounded-xl">
                <Clock className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
          {/* Completed Assignments Card */}
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-xs font-semibold mb-1">Completed Assignments</p>
                <p className="text-3xl font-bold">{completedAssignments}</p>
              </div>
              <div className="p-3 bg-white/25 rounded-xl">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </div>
        {/* Progress Section */}
        {completionRate > 0 && (
          <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-6 border-2 border-green-200 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-green-600" />
                  Your Amazing Progress
                </h3>
                <div className="w-full bg-green-200 rounded-full h-3 mb-3">
                  <div
                    className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${completionRate}%` }}
                  ></div>
                </div>
                <p className="text-green-800 font-semibold">
                  {completionRate >= 80
                    ? "🎉 Outstanding! You're crushing your goals!"
                    : completionRate >= 60
                      ? "💪 Fantastic progress! Keep it up!"
                      : "🚀 Great start! Every step counts!"}
                </p>
                <div className="mt-2 text-sm text-green-700">
                  <span className="font-semibold">{completedAssignments}</span> out of{" "}
                  <span className="font-semibold">{totalAssignments}</span> assignments completed
                  {dueAssignments > 0 && (
                    <span className="ml-3 text-orange-600 font-semibold">• {dueAssignments} assignments need work</span>
                  )}
                </div>
              </div>
              <div className="text-3xl font-bold text-green-600 ml-4">{completionRate}%</div>
            </div>
          </div>
        )}
        {/* Simplified Assignment Status Chart */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl mr-4">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Assignment Status Overview</h3>
              <p className="text-gray-600 mt-1">Track your academic progress</p>
            </div>
          </div>
          <div className="relative">
            <div className="h-64">
              <Doughnut data={assignmentStatusData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
      {/* AI Chat Assistant - Floating Widget */}
      <AIChatAssistant />
    </div>
  )
}
export default Dashboard
