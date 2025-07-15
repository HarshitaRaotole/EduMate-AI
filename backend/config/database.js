require("dotenv").config() // Ensure dotenv is loaded here
const mysql = require("mysql2/promise")

const dbConfig = {
  host: process.env.MYSQL_HOST || "localhost", // Use MYSQL_HOST
  user: process.env.MYSQL_USER || "root", // Use MYSQL_USER
  password: process.env.MYSQL_PASSWORD || "", // Use MYSQL_PASSWORD
  database: process.env.MYSQL_DATABASE || "edumate_ai", // Use MYSQL_DATABASE
  port: process.env.MYSQL_PORT || 3306, // ADDED: Use MYSQL_PORT, fallback to 3306
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // SSL configuration for production databases
  // Keep this for now, but be aware it might need specific Railway SSL certs if issues persist
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
