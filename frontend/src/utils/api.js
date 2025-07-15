import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.PROD
    ? "https://edumate-ai-slim.onrender.com/api" // Use full Render URL in production
    : "http://localhost:5000/api", // Use full URL in development
  timeout: 10000,
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

export default api
