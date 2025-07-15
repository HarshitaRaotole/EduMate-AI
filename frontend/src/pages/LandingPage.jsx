"use client"

import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import Footer from "../components/Footer.jsx" // Ensure this path is correct
import {
  BookOpen,
  Calendar,
  BarChart3,
  Mail,
  ArrowRight,
  CheckCircle,
  Target,
  Brain,
  Lightbulb,
  Sparkles,
} from "lucide-react"
import { AppHeader } from "../components/app-header.jsx" // Import the new header component

const LandingPage = () => {
  const { user } = useAuth() // Only need user for conditional rendering in main content

  const features = [
    {
      icon: Calendar,
      title: "Smart Study Scheduling",
      description: "AI-powered scheduling that adapts to your learning patterns and deadlines.",
    },
    {
      icon: BookOpen,
      title: "Subject Organization",
      description: "Keep all your courses, notes, and materials organized in one place.",
    },
    {
      icon: Target,
      title: "Goal Tracking",
      description: "Set academic goals and track your progress with detailed analytics.",
    },
    {
      icon: Brain,
      title: "AI Study Assistant",
      description: "Get personalized study recommendations based on your performance.",
    },
    {
      icon: Mail,
      title: "Smart Reminders",
      description: "Never miss a deadline with intelligent notifications and alerts.",
    },
    {
      icon: BarChart3,
      title: "Progress Analytics",
      description: "Visualize your academic progress with comprehensive reports.",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Use the shared AppHeader component */}
      <AppHeader />

      {/* Hero Section - Fully Responsive */}
      <section className="relative bg-gradient-to-b from-blue-50 to-white py-12 sm:py-16 lg:py-20 xl:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left order-2 lg:order-1">
              <div className="mb-4 sm:mb-6">
                <span className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-100 text-blue-800 text-xs sm:text-sm font-semibold rounded-full">
                  <Lightbulb className="mr-1.5 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  Smart Study Planner
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                Plan Your Studies,
                <span className="text-blue-600 block">Achieve Your Goals</span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                The intelligent study planner that helps you organize assignments, track progress, and stay on top of
                your academic goals with AI-powered insights.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                {user ? (
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white text-sm sm:text-base font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
                  >
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/register"
                      className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white text-sm sm:text-base font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
                    >
                      Start Planning Today
                      <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                    </Link>
                    <Link
                      to="/login"
                      className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-gray-700 text-sm sm:text-base font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                      Sign In
                    </Link>
                  </>
                )}
              </div>
            </div>
            {/* Right Content - Responsive Image */}
            <div className="relative order-1 lg:order-2">
              <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-xl sm:shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                  alt="Student planning studies with calendar and notes"
                  className="w-full h-[200px] xs:h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] xl:h-[450px] 2xl:h-[500px] object-cover"
                  crossOrigin="anonymous"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/10 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* NEW: Personalized Learning Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-md">
            <Sparkles className="h-6 w-6 sm:h-7 sm:w-7 text-blue-600" />
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Your Academic Journey, Personalized by AI
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            EduMateAI leverages cutting-edge artificial intelligence to understand your unique learning style, adapt to
            your pace, and provide tailored recommendations, ensuring you get the most out of every study session.
          </p>
          <div className="mt-8 sm:mt-10">
            {user ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white text-sm sm:text-base font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
              >
                Explore Your Personalized Dashboard
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            ) : (
              <Link
                to="/register"
                className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white text-sm sm:text-base font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
              >
                Start Your Personalized Plan
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            )}
          </div>
        </div>
      </section>
      {/* Features Section - Responsive Grid */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
              Our intelligent study planner provides all the tools you need to organize your academic life and achieve
              your goals.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
                  <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">{feature.title}</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Study Planning Showcase - Mobile Optimized */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
                Smart Planning Made Simple
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8">
                Our AI-powered study planner learns from your habits and helps you create the perfect study schedule
                that fits your lifestyle and maximizes your productivity.
              </p>
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-1">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900">Intelligent Scheduling</h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      AI analyzes your patterns to suggest optimal study times
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-1">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900">Progress Tracking</h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      Monitor your academic progress with detailed analytics
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-1">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900">Smart Reminders</h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      Never miss deadlines with personalized notifications
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative order-1 lg:order-2">
              <img
                src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                alt="Student organizing study schedule with planner and laptop"
                className="rounded-xl sm:rounded-2xl shadow-xl w-full h-[200px] xs:h-[250px] sm:h-[300px] md:h-[350px] lg:h-[300px] xl:h-[350px] 2xl:h-[400px] object-cover"
                crossOrigin="anonymous"
              />
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section - Mobile Optimized */}
      <section className="py-12 sm:py-16 lg:py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6">
            Ready to Transform Your Study Habits?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-blue-100 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Join thousands of students who have improved their academic performance with our intelligent study planner.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-6 sm:mb-8">
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
              className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-600 text-sm sm:text-base font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-lg"
            >
              Go to Dashboard
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
          ) : (
            <Link
              to="/register"
              className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-600 text-sm sm:text-base font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-lg"
            >
              Start Planning Today
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
          )}
        </div>
      </section>
      {/* Use the Footer Component */}
      <Footer />
    </div>
  )
}

export default LandingPage
