"use client"
import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom" // Added useLocation
import { useAuth } from "../contexts/AuthContext"
import { GraduationCap, Home, BookOpen, Calendar, Menu, X, LogOut, ChevronDown, Bell, Loader2 } from "lucide-react" // Added header icons and Loader2
import toast from "react-hot-toast"
import SmartReminders from "../components/SmartReminders" // Import SmartReminders

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null) // Declare error state
  const { register, user, logout } = useAuth() // Added user and logout from useAuth
  const navigate = useNavigate()
  const location = useLocation() // Added useLocation for isActive

  // Header specific state and functions (duplicated from DashboardLayout)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [showReminders, setShowReminders] = useState(false)

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Dashboard", href: "/dashboard", icon: GraduationCap },
    { name: "Subjects", href: "/dashboard/subjects", icon: BookOpen },
    { name: "Assignments", href: "/dashboard/assignments", icon: Calendar },
  ]

  const handleLogout = () => {
    logout()
    console.log("DEBUG: Attempting to redirect to home page using window.location.href.")
    window.location.href = "/" // Force a full page reload to the home page
  }

  const isActive = (href) => {
    if (href === "/dashboard") {
      return location.pathname === href
    }
    if (href === "/") {
      return location.pathname === href
    }
    return location.pathname.startsWith(href)
  }

  const getUserInitial = () => {
    return user?.name ? user.name.charAt(0).toUpperCase() : "U"
  }
  // End of header specific state and functions

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match")
      setError("Passwords do not match.") // Set error state for display
      setLoading(false)
      return
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long")
      setError("Password must be at least 6 characters long.") // Set error state for display
      setLoading(false)
      return
    }

    try {
      await register(formData.name, formData.email, formData.password)
      navigate("/dashboard")
    } catch (err) {
      // Changed error to err for consistency with catch block
      toast.error(err.response?.data?.error || "Registration failed")
      setError(err.response?.data?.error || "Registration failed. Please try again.") // Set error state for display
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col overflow-x-hidden">
      {/* Header with Full Navigation (Duplicated from DashboardLayout) */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500 rounded-xl shadow-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">EduMateAI</span>
            </div>
            {/* Center Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                    ${
                      isActive(item.href)
                        ? "text-blue-600 bg-blue-50 shadow-sm"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }
                  `}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
            {/* Right Side - User Menu and Reminders */}
            <div className="flex items-center space-x-4">
              {/* Bell Icon for Smart Reminders (only if user is logged in) */}
              {user && (
                <div className="relative">
                  <button
                    onClick={() => setShowReminders(!showReminders)}
                    className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                    aria-label="Toggle Smart Reminders"
                  >
                    <Bell className="h-5 w-5" />
                  </button>
                  {/* Smart Reminders Popover */}
                  {showReminders && (
                    <div className="absolute right-0 mt-2 w-80 max-h-[calc(100vh-5rem)] overflow-y-auto bg-white rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 z-50 p-4">
                      <SmartReminders />
                    </div>
                  )}
                </div>
              )}

              {/* Logged In User Menu / Auth Buttons */}
              {user ? (
                <div className="hidden md:block relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-semibold">{getUserInitial()}</span>
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-medium text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </button>
                  {/* User Dropdown */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 z-50">
                      <div className="py-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-xl"
                        >
                          <LogOut className="mr-3 h-4 w-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-sm bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                  >
                    Sign up
                  </Link>
                </div>
              )}
              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`
                  flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium
                  ${isActive(item.href) ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}
                `}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
          {/* Mobile User Section */}
          {user ? (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-5">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-semibold">{getUserInitial()}</span>
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-800">{user?.name}</div>
                  <div className="text-xs text-gray-500">{user?.email}</div>
                </div>
              </div>
              <div className="mt-3 px-2">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="px-3 sm:px-4 space-y-3">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full px-4 py-3 text-center text-gray-700 font-medium rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full px-4 py-3 text-center bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-colors"
                >
                  Sign up
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
      {/* Click outside to close user menu and reminders */}
      {userMenuOpen && <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />}
      {showReminders && <div className="fixed inset-0 z-40" onClick={() => setShowReminders(false)} />}
      {/* End of Header */}

      {/* Original Register Form UI */}
      <div className="flex-grow flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="card w-full max-w-md">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-500 rounded-xl shadow-lg">
                <GraduationCap className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Create Account</h1>
            <p className="text-sm sm:text-base text-gray-600">Join EduMateAI to manage your studies</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input"
                placeholder="Enter your full name"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input"
                placeholder="Create a password"
                required
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input"
                placeholder="Confirm your password"
                required
              />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary btn-md w-full">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-primary-600 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
