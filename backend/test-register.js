const axios = require("axios")

const testRegister = async () => {
  try {
    console.log("🚀 Testing registration endpoint...")

    const response = await axios.post(
      "http://localhost:5000/api/auth/register",
      {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    )

    console.log("✅ Registration successful!")
    console.log("📊 Response:", response.data)
  } catch (error) {
    console.error("❌ Registration failed:")
    console.error("Status:", error.response?.status)
    console.error("Error:", error.response?.data)
    console.error("Full error:", error.message)
  }
}

testRegister()
