"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Brain, Settings, Info, ArrowLeft, Download } from "lucide-react"
import { smartPrioritization } from "../services/smartPrioritizationService"
import SmartPriorityDashboard from "../components/SmartPriorityDashboard"
import api from "../utils/api"
import LoadingSpinner from "../components/LoadingSpinner"

const SmartPriority = () => {
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [userPreferences, setUserPreferences] = useState({})
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    fetchAssignments()
  }, [])

  const fetchAssignments = async () => {
    try {
      const response = await api.get("/assignments")
      setAssignments(response.data.assignments)
    } catch (error) {
      console.error("Error fetching assignments:", error)
    } finally {
      setLoading(false)
    }
  }

  const exportPriorityList = () => {
    const prioritized = smartPrioritization.prioritizeAssignments(assignments, userPreferences)
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Title,Subject,Deadline,Priority Score,Urgency Level,Recommendation\n" +
      prioritized
        .map(
          (a) =>
            `"${a.title}","${a.subject_name}","${a.deadline}",${a.aiPriority.totalScore},"${a.aiPriority.urgencyLevel}","${a.aiPriority.recommendation}"`,
        )
        .join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "smart-priority-list.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/dashboard" className="p-2 hover:bg-white/50 rounded-lg transition-colors mr-4">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Smart Priority Assistant
              </h1>
              <p className="text-gray-600 mt-1">AI-powered task prioritization and planning</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={exportPriorityList}
              className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Prioritization Settings</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject Importance Weights</label>
                <p className="text-xs text-gray-500 mb-3">
                  Adjust how much each subject affects priority scoring (1-10)
                </p>
                {/* Add subject weight controls here */}
                <div className="text-sm text-blue-600">Coming soon: Customizable subject weights</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority Factors</label>
                <p className="text-xs text-gray-500 mb-3">How the AI weighs different factors</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Deadline Urgency:</span>
                    <span className="font-medium">40%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Task Priority:</span>
                    <span className="font-medium">25%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subject Weight:</span>
                    <span className="font-medium">15%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Completion Status:</span>
                    <span className="font-medium">10%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Workload:</span>
                    <span className="font-medium">10%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* How It Works */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center mb-4">
            <Info className="h-5 w-5 text-blue-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">How Smart Prioritization Works</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Brain className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">AI Analysis</h4>
              <p className="text-sm text-gray-600">
                Analyzes deadline proximity, task priority, subject importance, and workload
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Settings className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Smart Scoring</h4>
              <p className="text-sm text-gray-600">
                Calculates priority scores using weighted factors and machine learning
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Download className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Actionable Plan</h4>
              <p className="text-sm text-gray-600">Provides daily focus tasks and weekly planning recommendations</p>
            </div>
          </div>
        </div>

        {/* Smart Priority Dashboard */}
        <SmartPriorityDashboard assignments={assignments} />
      </div>
    </div>
  )
}

export default SmartPriority
