"use client"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send, Bot, User, Sparkles, Loader2 } from "lucide-react" // Added Loader2 for consistency
import api from "../utils/api" // Assuming 'api' is configured to point to your backend

const AIChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null) // Ref for auto-scrolling

  const toggleChat = () => setIsOpen(!isOpen)

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessageContent = input.trim()
    setInput("")

    // Add user message to chat
    const newUserMessage = {
      id: Date.now(),
      role: "user",
      content: userMessageContent,
    }
    setMessages((prev) => [...prev, newUserMessage])
    setIsLoading(true)

    try {
      // Call your Express.js backend
      const response = await api.post("/chat/simple", {
        message: userMessageContent,
      })

      if (response.data.success) {
        const aiMessage = {
          id: Date.now() + 1,
          role: "assistant",
          content: response.data.response,
        }
        setMessages((prev) => [...prev, aiMessage])
      } else {
        // Handle specific errors from backend
        const errorMessage = {
          id: Date.now() + 1,
          role: "assistant",
          content: response.data.error || "Sorry, I'm having trouble responding right now. Please try again later.",
        }
        setMessages((prev) => [...prev, errorMessage])
      }
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: "Sorry, I'm having trouble connecting to the AI. Please check your network or try again later.",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={toggleChat}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full p-4 shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 group"
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <div className="relative">
              <MessageCircle className="h-6 w-6" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          )}
        </button>
        {/* Tooltip */}
        {!isOpen && (
          <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Ask EduMate AI for help! 🤖
          </div>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div
          className="fixed bottom-24
                     w-[calc(100vw-2rem)] max-w-sm mx-auto left-1/2 -translate-x-1/2
                     md:w-96 md:right-6 md:left-auto md:-translate-x-0
                     h-[500px] max-h-[calc(100vh-8rem)]
                     bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col overflow-hidden"
        >
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-full">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">EduMate AI</h3>
                  <p className="text-blue-100 text-sm">Your Academic Assistant</p>
                </div>
              </div>
              <button onClick={toggleChat} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <div className="p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl mb-4">
                  <Sparkles className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-800 mb-2">Welcome to EduMate AI! 🎓</h4>
                  <p className="text-gray-600 text-sm">I'm here to help you with your studies! Ask me about:</p>
                  <div className="mt-3 text-xs text-gray-500 space-y-1">
                    <div>📚 Study tips & techniques</div>
                    <div>📝 Assignment guidance</div>
                    <div>⏰ Time management</div>
                    <div>💡 Subject explanations</div>
                  </div>
                </div>
              </div>
            )}
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl p-3 ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                      : "bg-white border border-gray-200 text-gray-800"
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.role === "assistant" && <Bot className="h-4 w-4 mt-1 text-blue-500 flex-shrink-0" />}
                    {message.role === "user" && <User className="h-4 w-4 mt-1 text-white flex-shrink-0" />}
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</div>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl p-3 max-w-[80%]">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-4 w-4 text-blue-500" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} /> {/* Scroll target */}
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about your studies..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full p-2 transition-all duration-200"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default AIChatAssistant
