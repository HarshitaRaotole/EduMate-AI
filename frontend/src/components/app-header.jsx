"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { GraduationCap, Home, BookOpen, Calendar, Menu, X, LogOut, ChevronDown, Bell } from "lucide-react"
import SmartReminders from "./SmartReminders.jsx" // Assuming SmartReminders is in components

export function AppHeader() {
  const { user, logout } = useAuth()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showReminders, setShowReminders] = useState(false)
  const location = useLocation()

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Dashboard", href: "/dashboard", icon: GraduationCap },
    { name: "Subjects", href: "/dashboard/subjects", icon: BookOpen },
    { name: "Assignments", href: "/dashboard/assignments", icon: Calendar },
  ]

  // Define protected routes
  const protectedRoutes = ["/dashboard", "/dashboard/subjects", "/dashboard/assignments"]

  const handleLogout = () => {
    logout()
    setUserMenuOpen(false)
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

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo - Optimized for mobile */}
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            <div className="p-1.5 sm:p-2 bg-blue-500 rounded-lg sm:rounded-xl shadow-lg">
              <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
            </div>
            <span className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 truncate">EduMateAI</span>
          </div>
          {/* Desktop Navigation - Hidden on mobile/tablet, visible on laptop+ */}
          <nav className="hidden xl:flex items-center space-x-4 2xl:space-x-6">
            {navigation.map((item) => {
              const isProtected = protectedRoutes.includes(item.href)
              const targetHref = !user && isProtected ? "/login" : item.href
              const linkState = !user && isProtected ? { from: item.href } : {}

              return (
                <Link
                  key={item.name}
                  to={targetHref}
                  state={linkState}
                  className={`
                    flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200
                    ${isActive(item.href) ? "text-blue-600 bg-blue-50 shadow-sm" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}
                  `}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>
          {/* Right Side - Optimized for all screens */}
          <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 flex-shrink-0">
            {user && (
              <div className="relative">
                <button
                  onClick={() => setShowReminders(!showReminders)}
                  className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                  aria-label="Toggle Smart Reminders"
                >
                  <Bell className="h-5 w-5" />
                </button>
                {showReminders && (
                  <div className="absolute right-0 mt-2 w-80 max-h-[calc(100vh-5rem)] overflow-y-auto bg-white rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 z-50 p-4">
                    <SmartReminders />
                  </div>
                )}
              </div>
            )}
            {user ? (
              // Logged In User Menu - Hidden on mobile, visible on tablet+
              <div className="hidden md:block relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 lg:space-x-3 p-1.5 lg:p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-7 h-7 lg:w-8 lg:h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs lg:text-sm font-semibold">{getUserInitial()}</span>
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-medium text-gray-900 truncate max-w-24">{user?.name || "User"}</p>
                    <p className="text-xs text-gray-500 truncate max-w-24">{user?.email || ""}</p>
                  </div>
                  <ChevronDown className="h-3 w-3 lg:h-4 lg:w-4 text-gray-400" />
                </button>
                {/* User Dropdown */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-44 lg:w-48 bg-white rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-3 lg:px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-xl"
                      >
                        <LogOut className="mr-2 lg:mr-3 h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Auth Buttons - Optimized for tablet and laptop
              <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
                <Link
                  to="/login"
                  className="px-3 lg:px-4 py-1.5 lg:py-2 text-sm lg:text-base text-gray-700 font-medium rounded-lg lg:rounded-xl border border-gray-300 hover:bg-gray-50 transition-all duration-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 lg:px-6 py-1.5 lg:py-2 text-sm lg:text-base bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg lg:rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Sign up
                </Link>
              </div>
            )}
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            >
              {mobileMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
            </button>
          </div>
        </div>
        {/* Mobile Navigation Menu - Improved */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-gray-200 bg-white shadow-lg">
            <div className="px-3 sm:px-4 pt-2 pb-3 space-y-1">
              {navigation.map((item) => {
                const isProtected = protectedRoutes.includes(item.href)
                const targetHref = !user && isProtected ? "/login" : item.href
                const linkState = !user && isProtected ? { from: item.href } : {}

                return (
                  <Link
                    key={item.name}
                    to={targetHref}
                    state={linkState}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors
                      ${isActive(item.href) ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}
                    `}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </div>
            {/* Mobile Auth Section */}
            {!user && (
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
            {/* Mobile User Section */}
            {user && (
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex items-center px-4 sm:px-5 mb-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-semibold">{getUserInitial()}</span>
                  </div>
                  <div className="ml-3 min-w-0 flex-1">
                    <div className="text-sm font-medium text-gray-800 truncate">{user?.name || "User"}</div>
                    <div className="text-xs text-gray-500 truncate">{user?.email || ""}</div>
                  </div>
                </div>
                <div className="px-3 sm:px-4">
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-3 py-3 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                  >
                    <LogOut className="mr-3 h-5 w-5" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      {/* Click outside to close user menu and reminders */}
      {userMenuOpen && <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />}
      {showReminders && <div className="fixed inset-0 z-40" onClick={() => setShowReminders(false)} />}
    </header>
  )
}
