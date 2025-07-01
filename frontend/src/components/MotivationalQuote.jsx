"use client"

import { useState, useEffect } from "react"
import { RefreshCw, Lightbulb, Sparkles } from "lucide-react"
import { getMotivationalQuote, getTimeBasedQuote } from "../services/quotesService"

const MotivationalQuote = ({ context = "general", className = "" }) => {
  const [quote, setQuote] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const loadQuote = async () => {
    setIsLoading(true)
    setTimeout(() => {
      const newQuote = context === "time-based" ? getTimeBasedQuote() : getMotivationalQuote(context)
      setQuote(newQuote)
      setIsLoading(false)
    }, 300)
  }

  const refreshQuote = async () => {
    setIsRefreshing(true)
    setTimeout(() => {
      const newQuote = getMotivationalQuote("general")
      setQuote(newQuote)
      setIsRefreshing(false)
    }, 500)
  }

  useEffect(() => {
    loadQuote()
  }, [context])

  if (isLoading) {
    return (
      <div className={`bg-blue-50 border border-blue-200 rounded-2xl p-6 shadow-sm ${className}`}>
        <div className="animate-pulse">
          <div className="flex items-center mb-4">
            <div className="w-6 h-6 bg-blue-200 rounded-full mr-3"></div>
            <div className="h-5 bg-blue-200 rounded w-32"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-blue-200 rounded w-full"></div>
            <div className="h-4 bg-blue-200 rounded w-3/4"></div>
          </div>
          <div className="mt-4">
            <div className="h-3 bg-blue-200 rounded w-24"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`bg-blue-50 border border-blue-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="p-2 bg-blue-500 rounded-lg mr-3 shadow-sm">
            <Lightbulb className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-bold text-blue-900 flex items-center">
            <Sparkles className="h-4 w-4 mr-2 text-blue-600" />
            Daily Inspiration
          </h3>
        </div>
        <button
          onClick={refreshQuote}
          disabled={isRefreshing}
          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-300 disabled:opacity-50 hover:scale-110"
          title="Get new inspiration"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
        </button>
      </div>

      {quote && (
        <div className="space-y-4">
          <blockquote className="text-blue-800 text-base leading-relaxed font-medium italic">"{quote.text}"</blockquote>
          <cite className="text-blue-600 font-semibold not-italic text-sm block">— {quote.author}</cite>
        </div>
      )}
    </div>
  )
}

export default MotivationalQuote
