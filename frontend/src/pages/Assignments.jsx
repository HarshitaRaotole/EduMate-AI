"use client"

import { useState, useEffect } from "react"
import {
  Calendar,
  Plus,
  Edit,
  Trash2,
  Loader2,
  CheckCircle,
  Clock,
  PlayCircle,
  AlertTriangle,
  Target,
} from "lucide-react"
import api from "../utils/api"
import toast from "react-hot-toast"
import LoadingSpinner from "../components/LoadingSpinner"

const Assignments = () => {
  const [assignments, setAssignments] = useState([])
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingAssignment, setEditingAssignment] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
    priority: "medium",
    status: "pending",
    subject_id: "",
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [assignmentsResponse, subjectsResponse] = await Promise.all([api.get("/assignments"), api.get("/subjects")])

      setAssignments(assignmentsResponse.data.assignments)
      setSubjects(subjectsResponse.data.subjects)
    } catch (error) {
      toast.error("Failed to fetch data")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const url = editingAssignment ? `/assignments/${editingAssignment.id}` : "/assignments"
      const method = editingAssignment ? "put" : "post"

      await api[method](url, {
        ...formData,
        subject_id: Number.parseInt(formData.subject_id),
      })

      await fetchData()
      setShowModal(false)
      setEditingAssignment(null)
      resetForm()
      toast.success(editingAssignment ? "Assignment updated!" : "Assignment created!")
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to save assignment")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (assignment) => {
    setEditingAssignment(assignment)
    setFormData({
      title: assignment.title,
      description: assignment.description || "",
      deadline: assignment.deadline,
      priority: assignment.priority,
      status: assignment.status,
      subject_id: assignment.subject_id.toString(),
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this assignment?")) {
      return
    }

    try {
      await api.delete(`/assignments/${id}`)
      setAssignments(assignments.filter((assignment) => assignment.id !== id))
      toast.success("Assignment deleted!")
    } catch (error) {
      toast.error("Failed to delete assignment")
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      deadline: "",
      priority: "medium",
      status: "pending",
      subject_id: "",
    })
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
        return <Clock className="h-5 w-5 text-red-600" />
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "submitted":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            Submitted
          </span>
        )
      case "in_progress":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
            In Progress
          </span>
        )
      case "pending":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
            Pending
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
            Pending
          </span>
        )
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

  const sortedAssignments = [...assignments].sort((a, b) => {
    const deadlineA = new Date(a.deadline).getTime()
    const deadlineB = new Date(b.deadline).getTime()

    if (deadlineA !== deadlineB) {
      return deadlineA - deadlineB
    }

    const priorityOrder = { high: 3, medium: 2, low: 1 }
    return priorityOrder[b.priority] - priorityOrder[a.priority]
  })

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="space-y-8 p-6">
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Assignments
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-4 sm:mb-6">
            Track and manage your academic assignments.
          </p>
          <button
            onClick={() => setShowModal(true)}
            disabled={subjects.length === 0}
            className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold text-sm sm:text-base rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            Add Assignment
          </button>
        </div>

        {subjects.length === 0 && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center">
              <AlertTriangle className="h-6 w-6 text-yellow-600 mr-3" />
              <div>
                <p className="text-yellow-800 font-semibold">
                  You need to create at least one subject before adding assignments.{" "}
                  <a href="/dashboard/subjects" className="underline hover:no-underline font-bold">
                    Create a subject first
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}

        {sortedAssignments.length > 0 ? (
          <div className="space-y-6">
            {sortedAssignments.map((assignment) => (
              <div
                key={assignment.id}
                className={`bg-white rounded-2xl p-6 shadow-xl border-l-4 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1 ${
                  isOverdue(assignment.deadline) && assignment.status !== "submitted"
                    ? "border-red-400 bg-red-50"
                    : "border-blue-400"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      {getStatusIcon(assignment.status)}
                      <h3 className="text-xl font-bold text-gray-900">{assignment.title}</h3>
                      <div className={`w-3 h-3 rounded-full shadow-sm ${getPriorityColor(assignment.priority)}`} />
                    </div>

                    <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-4 h-4 rounded-full shadow-sm"
                          style={{ backgroundColor: assignment.subject_color }}
                        />
                        <span className="font-medium">{assignment.subject_name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span
                          className={`font-medium ${
                            isOverdue(assignment.deadline) && assignment.status !== "submitted"
                              ? "text-red-600"
                              : "text-gray-600"
                          }`}
                        >
                          Due {formatDate(assignment.deadline)}
                        </span>
                      </div>
                    </div>

                    {assignment.description && (
                      <p className="text-gray-600 mb-4 leading-relaxed">{assignment.description}</p>
                    )}
                  </div>

                  <div className="flex items-center space-x-4">
                    {getStatusBadge(assignment.status)}
                    <button
                      onClick={() => handleEdit(assignment)}
                      className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="h-5 w-5 text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(assignment.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-5 w-5 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center shadow-xl border border-gray-100">
            <div className="p-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Target className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No assignments yet</h3>
            <p className="text-gray-600 mb-6 text-lg">
              Create your first assignment to start tracking your academic work.
            </p>
            {subjects.length > 0 && (
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <Plus className="mr-2 h-5 w-5" />
                Add Your First Assignment
              </button>
            )}
          </div>
        )}

        {/* Enhanced Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity backdrop-blur-sm"
                onClick={() => {
                  setShowModal(false)
                  setEditingAssignment(null)
                  resetForm()
                }}
              />

              <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <form onSubmit={handleSubmit}>
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
                    <h3 className="text-xl font-bold text-white flex items-center">
                      <Target className="mr-2 h-6 w-6" />
                      {editingAssignment ? "Edit Assignment" : "Add New Assignment"}
                    </h3>
                  </div>

                  <div className="bg-white px-6 py-6 space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Assignment Title</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="e.g., Math Problem Set 1"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                      <select
                        value={formData.subject_id}
                        onChange={(e) => setFormData({ ...formData, subject_id: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        required
                      >
                        <option value="">Select a subject</option>
                        {subjects.map((subject) => (
                          <option key={subject.id} value={subject.id}>
                            {subject.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Description (Optional)</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Assignment details and requirements"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Deadline</label>
                        <input
                          type="date"
                          value={formData.deadline}
                          onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
                        <select
                          value={formData.priority}
                          onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="submitted">Submitted</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-gray-50 px-6 py-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl sm:ml-3"
                    >
                      {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {editingAssignment ? "Update Assignment" : "Create Assignment"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false)
                        setEditingAssignment(null)
                        resetForm()
                      }}
                      className="mt-3 sm:mt-0 w-full sm:w-auto inline-flex justify-center px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl border border-gray-300 hover:bg-gray-50 transition-all duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Assignments
