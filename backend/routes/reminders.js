const express = require("express")
const router = express.Router()
const { GoogleGenerativeAI } = require("@google/generative-ai")
// const path = require("path") // No longer needed if dotenv config is removed
// require("dotenv").config({ path: path.resolve(__dirname, "../.env") }) // REMOVED: This line is not needed on Render

// Assuming your database connection is available via a utility
const db = require("../config/database") // Adjust path if necessary

// Initialize Gemini API
// CORRECTED: Use process.env.GEMINI_API_KEY to match Render's environment variable name
// Ensure this line uses GOOGLE_API_KEY
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }) // Using gemini-1.5-flash

// Helper function to generate smart reminders using Gemini
async function generateSmartReminders(assignments) {
  console.log("DEBUG: Entering generateSmartReminders function.")
  if (!assignments || assignments.length === 0) {
    console.log("DEBUG: No assignments provided for reminder generation. Returning empty array.")
    return []
  }
  const assignmentList = assignments
    .map((a) => `- Title: ${a.title}, Due Date: ${a.deadline}, Status: ${a.status}, Subject: ${a.subject_name}`)
    .join("\n")

  const prompt = `You are an academic assistant. Based on the following list of assignments, generate 3-5 smart, actionable reminders for a student. Focus on proactive steps, study tips, or time management advice related to these assignments.
    Assignments:
  ${assignmentList}
    Format your response as a JSON array of objects, where each object has 'title', 'description', 'dueDate' (YYYY-MM-DD), 'time' (HH:MM AM/PM), 'priority' (urgent, high, medium, low), and 'category' (Study, Assignment, Planning, Wellness). Ensure due dates are relevant to the assignments provided. If an assignment is due soon, suggest an urgent reminder. If no specific time is relevant, use a default like "09:00 AM".
    Example JSON structure:
  [
    {
      "title": "Start research for History Essay",
      "description": "Begin gathering sources and outlining for the upcoming essay.",
      "dueDate": "2025-07-20",
      "time": "09:00 AM",
      "priority": "high",
      "category": "Assignment"
    }
  ]`

  console.log("DEBUG: Sending prompt to Gemini API...")
  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    console.log("DEBUG: Raw Gemini response text:", text)

    let jsonString = text.replace(/```json\n|```/g, "").trim()
    if (!jsonString.startsWith("[") || !jsonString.endsWith("]")) {
      console.warn("Gemini response was not a clean JSON array, attempting to fix:", jsonString)
      const match = jsonString.match(/\[.*\]/s)
      if (match) {
        jsonString = match[0]
        console.log("DEBUG: Fixed JSON string:", jsonString)
      } else {
        throw new Error("Gemini did not return a valid JSON array for reminders.")
      }
    }
    const parsedReminders = JSON.parse(jsonString)
    console.log("DEBUG: Successfully parsed Gemini response:", parsedReminders)
    return parsedReminders
  } catch (error) {
    console.error("ERROR: Error generating reminders with Gemini:", error)
    return [
      {
        title: "Check your assignment deadlines (Fallback)",
        description: "Review your upcoming assignments to plan your week.",
        dueDate: new Date().toISOString().split("T")[0],
        time: "09:00 AM",
        priority: "medium",
        category: "Planning",
      },
    ]
  }
}

// Route to get smart reminders for a user
router.get("/smart", async (req, res) => {
  console.log("DEBUG: Received request for /reminders/smart")
  const userId = req.user?.id
  if (!userId) {
    console.error("ERROR: Unauthorized - User ID not found in request.user. Token might be missing or invalid.")
    return res.status(401).json({ success: false, error: "Unauthorized: User ID not found." })
  }
  console.log(`DEBUG: Authenticated user ID: ${userId}`)
  try {
    console.log("DEBUG: Attempting to fetch user assignments from database...")
    const assignmentsResult = await db.query(
      `SELECT a.id, a.title, a.deadline, a.status, s.name AS subject_name
         FROM assignments a
         JOIN subjects s ON a.subject_id = s.id
         WHERE a.user_id = ? AND a.status != 'submitted'
         ORDER BY a.deadline ASC`,
      [userId],
    )
    const assignments = assignmentsResult.rows || assignmentsResult
    console.log("DEBUG: Fetched assignments:", assignments)
    if (assignments.length === 0) {
      console.log("DEBUG: No active assignments found for user. Returning empty reminders.")
      return res.json({ success: true, reminders: [] })
    }
    console.log("DEBUG: Generating smart reminders using Gemini...")
    const smartReminders = await generateSmartReminders(assignments)
    console.log("DEBUG: Smart reminders generated:", smartReminders)
    res.json({ success: true, reminders: smartReminders })
  } catch (error) {
    console.error("ERROR: Error fetching smart reminders in /smart route:", error)
    res.status(500).json({ success: false, error: "Failed to fetch smart reminders." })
  }
})

module.exports = router
