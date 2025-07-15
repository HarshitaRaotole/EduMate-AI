"use client"

import { useState, useEffect } from "react"
import api from "../utils/api"
import { CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon, ClockIcon } from "@heroicons/react/24/solid"

const SmartReminders = () => {
  const [reminders, setReminders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchReminders()
  }, [])

  const fetchReminders = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get("/reminders/smart")
      if (Array.isArray(response.data.reminders)) {
        setReminders(response.data.reminders)
      } else {
        console.warn("DEBUG (Frontend): API response was not an array or missing 'reminders' property:", response.data)
        setReminders([])
      }
      setLoading(false)
    } catch (err) {
      console.error("Failed to fetch reminders:", err)
      setError(err.message || "Failed to fetch reminders")
      setLoading(false)
      // Mock data for demonstration purposes in case the backend is not available
      setReminders([
        {
          title: "Review Chapter 3 for Biology (Mock)",
          description: "Don't forget to review the key concepts and definitions.",
          dueDate: "2025-07-15",
          time: "10:00 AM",
          priority: "high",
          category: "Study",
        },
        {
          title: "Submit English Essay Draft (Mock)",
          description: "Ensure you've addressed all rubric points before submission.",
          dueDate: "2025-07-16",
          time: "05:00 PM",
          priority: "urgent",
          category: "Assignment",
        },
        {
          title: "Prepare for Math Quiz (Mock)",
          description: "Practice problems from sections 1.1-1.3.",
          dueDate: "2025-07-18",
          time: "09:00 AM",
          priority: "medium",
          category: "Study",
        },
      ])
    }
  }

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "high":
        return <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
      case "medium":
        return <InformationCircleIcon className="h-5 w-5 text-yellow-500" aria-hidden="true" />
      case "urgent":
        return <ClockIcon className="h-5 w-5 text-orange-500" aria-hidden="true" />
      default:
        return <CheckCircleIcon className="h-5 w-5 text-green-500" aria-hidden="true" />
    }
  }

  if (loading) {
    return <div className="p-4">Loading reminders...</div>
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error} - Displaying mock data.</div>
  }

  return (
    <div className="container mx-auto p-4">
      {/* Adjusted heading size for responsiveness */}
      <h1 className="text-xl sm:text-2xl font-semibold mb-4">Smart Reminders</h1>
      {reminders.length === 0 ? (
        <div className="p-4 text-gray-500">No reminders found.</div>
      ) : (
        <div className="divide-y divide-gray-200">
          {reminders.map((reminder, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 border-b border-gray-100 last:border-b-0">
              {getPriorityIcon(reminder.priority)}
              <div className="flex-1">
                {/* Adjusted title size for responsiveness */}
                <h3 className="text-base sm:text-lg font-medium">{reminder.title}</h3>
                <p className="text-sm text-gray-500">{reminder.description}</p>
                <div className="mt-1 text-sm text-gray-700">
                  Due: {reminder.dueDate} at {reminder.time}
                </div>
                <div className="mt-1 text-sm text-gray-700">Category: {reminder.category}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SmartReminders
