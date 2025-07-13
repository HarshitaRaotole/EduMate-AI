const express = require("express")
const router = express.Router()
const { GoogleGenerativeAI } = require("@google/generative-ai")
const path = require("path") // Import path module
// Load environment variables from the .env file in the backend directory
// This ensures process.env.GOOGLE_API_KEY is available
require("dotenv").config({ path: path.resolve(__dirname, "../.env") })

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)
// FIX: Changed model from 'gemini-pro' to 'gemini-1.5-flash'
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

router.post("/simple", async (req, res) => {
  try {
    const { message } = req.body
    if (!message) {
      return res.status(400).json({ error: "Message is required" })
    }
    // Start a chat session with a system prompt (persona)
    // Gemini handles system instructions as part of the chat history.
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [
            {
              text: `You are EduMate AI, a helpful academic assistant for students. You help with:
      - Study tips and techniques
      - Assignment guidance and planning
      - Subject explanations
      - Time management for academics
      - Motivation and academic support
      - General academic questions
            Keep responses helpful, encouraging, and focused on education. Be concise but thorough.`,
            },
          ],
        },
        {
          role: "model",
          parts: [{ text: "Hello! How can I assist you with your studies today?" }], // Initial response from AI to set the tone
        },
      ],
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.7,
      },
    })
    // Send the user's message to Gemini
    const result = await chat.sendMessage(message)
    const response = await result.response
    const text = response.text() // Extract the text content from the response
    res.json({
      success: true,
      response: text,
    })
  } catch (error) {
    console.error("Gemini Chat API Error:", error)
    // Check for specific error messages from Gemini API
    if (error.message.includes("404 Not Found") || error.message.includes("model not found")) {
      res.status(404).json({
        success: false,
        error: "Gemini model not found or not available. Please check the model name and API key.",
      })
    } else if (error.message.includes("quota exceeded")) {
      res.status(429).json({
        success: false,
        error: "Gemini API quota exceeded. Please check your usage limits or try again later.",
      })
    } else if (error.message.includes("API key not valid")) {
      res.status(401).json({
        success: false,
        error: "Invalid Gemini API key. Please check your GOOGLE_API_KEY.",
      })
    } else {
      res.status(500).json({
        success: false,
        error: "Failed to process chat request with Gemini. Please try again.",
      })
    }
  }
})

module.exports = router
