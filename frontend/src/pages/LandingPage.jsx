"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import {
  GraduationCap,
  Home,
  BookOpen,
  Calendar,
  BarChart3,
  Mail,
  Shield,
  Zap,
  ChevronDown,
  LogOut,
  Star,
  ArrowRight,
  CheckCircle,
  Menu,
  X,
} from "lucide-react"

const LandingPage = () => {
  const { user, logout } = useAuth()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigation = [
    { name: "Home", href: "/", icon: Home, active: true },
    { name: "Dashboard", href: "/dashboard", icon: GraduationCap },
    { name: "Subjects", href: "/dashboard/subjects", icon: BookOpen },
    { name: "Assignments", href: "/dashboard/assignments", icon: Calendar },
  ]

  const handleLogout = () => {
    logout()
    setUserMenuOpen(false)
  }

  // Get user's initial letter
  const getUserInitial = () => {
    return user?.name ? user.name.charAt(0).toUpperCase() : "U"
  }

  const features = [
    {
      icon: BookOpen,
      title: "Subject Management",
      description: "Organize all your courses and subjects in one place with color-coded categories.",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      icon: Calendar,
      title: "Assignment Tracking",
      description: "Keep track of all your assignments with deadlines, priorities, and progress status.",
      gradient: "from-emerald-500 to-green-600",
    },
    {
      icon: BarChart3,
      title: "Progress Analytics",
      description: "Visualize your academic progress with detailed charts and completion rates.",
      gradient: "from-purple-500 to-purple-600",
    },
    {
      icon: Mail,
      title: "Smart Reminders",
      description: "Never miss a deadline with intelligent email reminders for upcoming assignments.",
      gradient: "from-amber-500 to-orange-500",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your academic data is protected with industry-standard security and encryption.",
      gradient: "from-red-500 to-red-600",
    },
    {
      icon: Zap,
      title: "AI-Powered",
      description: "Leverage artificial intelligence to optimize your study schedule and productivity.",
      gradient: "from-indigo-500 to-indigo-600",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header with Dashboard Style */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="mobile-container">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
              <div className="p-1.5 sm:p-2 bg-blue-500 rounded-lg sm:rounded-xl shadow-lg">
                <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-gray-900 truncate">EduMateAI</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    flex items-center space-x-2 px-3 py-2 rounded-md text-xs xl:text-sm font-medium transition-colors
                    ${
                      item.active
                        ? "text-primary-600 bg-primary-50"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }
                  `}
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>

            {/* User Menu & Mobile Menu Button */}
            <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
              {user ? (
                // Logged In User Menu
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
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                      <div className="py-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <LogOut className="mr-3 h-4 w-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Logged Out Auth Buttons
                <div className="hidden md:flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-gray-700 font-medium rounded-xl border border-gray-300 hover:bg-gray-50 transition-all duration-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Get Started
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="mobile-container py-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center space-x-3 px-3 py-3 rounded-md text-sm font-medium
                    ${
                      item.active
                        ? "text-primary-600 bg-primary-50"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }
                  `}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>

            {/* Mobile User Section */}
            {user ? (
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex items-center mobile-container">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-semibold">{getUserInitial()}</span>
                  </div>
                  <div className="ml-3 min-w-0 flex-1">
                    <div className="text-sm font-medium text-gray-800 truncate">{user?.name}</div>
                    <div className="text-xs text-gray-500 truncate">{user?.email}</div>
                  </div>
                </div>
                <div className="mt-3 mobile-container">
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-3 py-3 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  >
                    <LogOut className="mr-3 h-5 w-5" />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="mobile-container space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-center text-gray-700 font-medium rounded-xl border border-gray-300 hover:bg-gray-50"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-center bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 sm:py-20 text-center">
        <div className="max-w-5xl mx-auto">
          <div className="mb-4 sm:mb-6">
            <span className="inline-flex items-center px-3 py-1 sm:px-4 sm:py-2 bg-blue-100 text-blue-800 text-xs sm:text-sm font-semibold rounded-full mb-4">
              <Star className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              AI-Powered Study Companion
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4 sm:mb-6 leading-tight">
            Transform Your Academic Journey
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-10 leading-relaxed max-w-3xl mx-auto px-4">
            Organize your subjects, track assignments, and stay on top of your academic goals with intelligent reminders
            and progress tracking. Join thousands of students achieving excellence.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            {user ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold text-sm sm:text-base rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold text-sm sm:text-base rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                >
                  Start Learning Today
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-gray-700 font-bold text-sm sm:text-base rounded-xl border border-gray-300 hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-12 sm:py-20">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-3 sm:mb-4">
            Everything You Need to Excel
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            EduMateAI provides all the tools you need to manage your academic life efficiently and effectively.
          </p>
        </div>
        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-100 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
            >
              <div
                className={`mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg`}
              >
                <feature.icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-gray-900">{feature.title}</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-12 sm:py-20">
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-8 sm:p-12 text-white text-center shadow-2xl">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
            Ready to Transform Your Academic Journey?
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-blue-100 max-w-2xl mx-auto px-4">
            Join thousands of students who are already using EduMateAI to achieve their academic goals and unlock their
            full potential.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-6 mb-6 sm:mb-8">
            <div className="flex items-center text-blue-100 text-sm sm:text-base">
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              <span>Free to start</span>
            </div>
            <div className="flex items-center text-blue-100 text-sm sm:text-base">
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center text-blue-100 text-sm sm:text-base">
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              <span>Setup in minutes</span>
            </div>
          </div>
          {user ? (
            <Link
              to="/dashboard"
              className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-600 font-bold text-sm sm:text-base rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              Go to Dashboard
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
          ) : (
            <Link
              to="/register"
              className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-600 font-bold text-sm sm:text-base rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              Get Started for Free
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 border-t border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <div className="p-2 bg-blue-500 rounded-xl shadow-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">EduMateAI</span>
          </div>
          <p className="text-gray-600">© 2024 EduMateAI. All rights reserved.</p>
        </div>
      </footer>

      {/* Click outside to close user menu */}
      {userMenuOpen && <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />}
    </div>
  )
}

export default LandingPage
