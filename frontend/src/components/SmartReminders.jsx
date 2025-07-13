"use client"

import { Bell, CalendarDays, Clock } from "lucide-react"
import { useState, useEffect } from "react"
import api from "../utils/api" // Assuming you have an API utility

export default function SmartReminders() {
  const [reminders, setReminders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await api.get("/reminders/smart") // Fetch from your backend API

        // ADDED: Log the full response data to inspect its structure
        console.log("DEBUG (Frontend): API Response for Smart Reminders:", response.data)

        // Ensure response.data.reminders exists and is an array
        if (response.data && Array.isArray(response.data.reminders)) {
          setReminders(response.data.reminders)
        } else {
          console.warn("DEBUG (Frontend): API response did not contain an array of reminders:", response.data)
          setReminders([]) // Set to empty array if data is not as expected
        }
      } catch (err) {
        console.error("Error fetching smart reminders:", err)
        setError("Failed to load smart reminders. Please try again later.")
        // Fallback to mock data if API fails (keep for debugging, remove in production)
        setReminders([
          {
            id: 1,
            title: "Review Chapter 3 for Biology (Mock)",
            description: "Don't forget to review the key concepts and definitions.",
            dueDate: "2025-07-15",
            time: "10:00 AM",
            priority: "high",
            category: "Study",
          },
          {
            id: 2,
            title: "Submit English Essay Draft (Mock)",
            description: "Ensure you've addressed all rubric points before submission.",
            dueDate: "2025-07-16",
            time: "05:00 PM",
            priority: "urgent",
            category: "Assignment",
          },
          {
            id: 3,
            title: "Prepare for Math Quiz (Mock)",
            description: "Practice problems from sections 1.1-1.3.",
            dueDate: "2025-07-18",
            time: "09:00 AM",
            priority: "medium",
            category: "Study",
          },
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchReminders()
  }, [])

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "medium":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
      <div className="flex items-center mb-5">
        <div className="p-2.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg mr-3">
          <Bell className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Smart Reminders</h2>
          <p className="text-sm text-gray-600 mt-0.5">Your personalized nudges for academic success</p>
        </div>
      </div>
      <div>
        {loading ? (
          <div className="text-center text-gray-500 py-6">Loading smart reminders...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-6">{error}</div>
        ) : reminders.length === 0 ? (
          <div className="text-center text-gray-500 py-6">No smart reminders for now! Keep up the great work.</div>
        ) : (
          <div className="space-y-0">
            {reminders.map((reminder) => (
              <div
                key={reminder.id}
                className="flex items-start space-x-3 p-3 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex-shrink-0 mt-0.5">
                  <Bell className="h-4 w-4 text-blue-500" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800 text-base">{reminder.title}</h4>
                  {reminder.description && <p className="text-xs text-gray-700 mt-0.5">{reminder.description}</p>}
                  <div className="flex items-center text-xs text-gray-600 mt-1 space-x-2">
                    <div className="flex items-center">
                      <CalendarDays className="h-3.5 w-3.5 mr-1 text-gray-400" />
                      <span>{reminder.dueDate}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3.5 w-3.5 mr-1 text-gray-400" />
                      <span>{reminder.time}</span>
                    </div>
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    <div
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium text-white ${getPriorityColor(reminder.priority)}`}
                    >
                      {reminder.priority.charAt(0).toUpperCase() + reminder.priority.slice(1)} Priority
                    </div>
                    <div className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border border-blue-300 text-blue-700 bg-blue-50">
                      {reminder.category}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
