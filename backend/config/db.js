// const mysql = require("mysql2");
// require("dotenv").config();

// const pool = mysql.createPool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     connection: 10,
//     multipleStatements: true,
// });

// const db = pool.promise();
// module.exports = db;
const mysql = require("mysql2");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME,
  connectionLimit: 10, // Max connections
  multipleStatements: true, // Allows running multiple queries
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
  } else {
    console.log("✅ Connected to MySQL");
    connection.release();
  }
});

module.exports = pool.promise();
