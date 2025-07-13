require("dotenv").config() // Ensure dotenv is loaded here

const mysql = require("mysql2/promise")

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root", // This will now correctly use process.env.DB_USER
  password: process.env.DB_PASSWORD || "", // This will now correctly use process.env.DB_PASSWORD
  database: process.env.DB_NAME || "edumate_ai",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // SSL configuration for production databases
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
}

let pool = null

const getPool = () => {
  if (!pool) {
    pool = mysql.createPool(dbConfig)
  }
  return pool
}

const query = async (sql, params = []) => {
  const connection = getPool()
  const [results] = await connection.execute(sql, params)
  return results
}

module.exports = { query, getPool }
