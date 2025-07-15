"use client"

import { useState, useEffect } from "react"
import { BookOpen, Plus, Trash2, Loader2, Star, Palette } from "lucide-react"
import api from "../utils/api"
import toast from "react-hot-toast"
import LoadingSpinner from "../components/LoadingSpinner"

const Subjects = () => {
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#3B82F6",
  })
  const [submitting, setSubmitting] = useState(false)
  const colors = [
    { color: "#3B82F6", name: "Blue" },
    { color: "#EF4444", name: "Red" },
    { color: "#10B981", name: "Green" },
    { color: "#F59E0B", name: "Amber" },
    { color: "#8B5CF6", name: "Purple" },
    { color: "#EC4899", name: "Pink" },
    { color: "#06B6D4", name: "Cyan" },
    { color: "#84CC16", name: "Lime" },
  ]

  useEffect(() => {
    fetchSubjects()
  }, [])

  const fetchSubjects = async () => {
    try {
      const response = await api.get("/subjects")
      setSubjects(response.data.subjects)
    } catch (error) {
      toast.error("Failed to fetch subjects")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const response = await api.post("/subjects", formData)
      setSubjects([response.data.subject, ...subjects])
      setShowModal(false)
      setFormData({ name: "", description: "", color: "#3B82F6" })
      toast.success("Subject created successfully!")
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to create subject")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this subject? This will also delete all associated assignments.")) {
      return
    }
    try {
      await api.delete(`/subjects/${id}`)
      setSubjects(subjects.filter((subject) => subject.id !== id))
      toast.success("Subject deleted successfully!")
    } catch (error) {
      toast.error("Failed to delete subject")
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="space-y-8 p-6">
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Subjects
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-4 sm:mb-6">
            Manage your academic subjects and courses.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold text-sm sm:text-base rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <Plus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            Add Subject
          </button>
        </div>
        {subjects.length > 0 ? (
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {subjects.map((subject) => (
              <div
                key={subject.id}
                className="group bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-full shadow-lg" style={{ backgroundColor: subject.color }} />
                    <h3 className="text-xl font-bold text-gray-900">{subject.name}</h3>
                  </div>
                  <button
                    onClick={() => handleDelete(subject.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="h-5 w-5 text-red-600" />
                  </button>
                </div>
                {subject.description && <p className="text-gray-600 mb-4 leading-relaxed">{subject.description}</p>}
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-500">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Created {new Date(subject.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div
                      className="px-3 py-1 rounded-full text-xs font-medium text-white shadow-sm"
                      style={{ backgroundColor: subject.color }}
                    >
                      Active
                    </div>
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center shadow-xl border border-gray-100">
            <div className="p-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <BookOpen className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No subjects yet</h3>
            <p className="text-gray-600 mb-6 text-lg">
              Create your first subject to start organizing your assignments and studies.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Plus className="mr-2 h-5 w-5" />
              Add Your First Subject
            </button>
          </div>
        )}
        {/* Enhanced Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity backdrop-blur-sm"
                onClick={() => setShowModal(false)}
              />
              <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <form onSubmit={handleSubmit}>
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
                    <h3 className="text-xl font-bold text-white flex items-center">
                      <Star className="mr-2 h-6 w-6" />
                      Add New Subject
                    </h3>
                  </div>
                  <div className="bg-white px-6 py-6 space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Subject Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="e.g., Mathematics, Computer Science"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Description (Optional)</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Brief description of the subject"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                        <Palette className="mr-2 h-4 w-4" />
                        Color Theme
                      </label>
                      <div className="grid grid-cols-4 gap-3">
                        {colors.map(({ color, name }) => (
                          <button
                            key={color}
                            type="button"
                            className={`relative w-full h-12 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                              formData.color === color ? "border-gray-900 shadow-lg" : "border-gray-300"
                            }`}
                            style={{ backgroundColor: color }}
                            onClick={() => setFormData({ ...formData, color })}
                            title={name}
                          >
                            {formData.color === color && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-3 h-3 bg-white rounded-full shadow-sm" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-6 py-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl sm:ml-3"
                    >
                      {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Create Subject
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
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

export default Subjects
