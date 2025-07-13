"use client"
import { useState } from "react"
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { GraduationCap, Home, BookOpen, Calendar, Menu, X, LogOut, ChevronDown, Bell } from "lucide-react"
import SmartReminders from "../components/SmartReminders"

const DashboardLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [showReminders, setShowReminders] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Dashboard", href: "/dashboard", icon: GraduationCap },
    { name: "Subjects", href: "/dashboard/subjects", icon: BookOpen },
    { name: "Assignments", href: "/dashboard/assignments", icon: Calendar },
  ]

  const handleLogout = () => {
    logout()
    console.log("DEBUG: Attempting to redirect to home page using window.location.href.")
    window.location.href = "/" // CHANGED: Force a full page reload to the home page
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

  // Get user's initial letter
  const getUserInitial = () => {
    return user?.name ? user.name.charAt(0).toUpperCase() : "U"
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Header with Full Navigation */}
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
              {/* Bell Icon for Smart Reminders */}
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

              {/* Logged In User Menu */}
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
        </div>
      )}
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <Outlet />
      </main>
      {/* Click outside to close user menu and reminders */}
      {userMenuOpen && <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />}
      {showReminders && <div className="fixed inset-0 z-40" onClick={() => setShowReminders(false)} />}
    </div>
  )
}

export default DashboardLayout
