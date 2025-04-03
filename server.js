const mysql = require("mysql2");
const express = require("express");

const app = express();
const PORT = 3000;

// Create MySQL connection
const db = mysql.createConnection({
    host: "localhost",
    user: "sanchit",       // Change this if needed
    password: "pass@123",  // Change this if needed
    database: "biomed_inventory"
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
    } else {
        console.log("MySQL Connected...");
    }
});

// ✅ Export `db` BEFORE requiring routes
module.exports = db;

// Middleware to parse JSON
app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.send("Server is working!");
});

// Import routes (after exporting `db`)
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const inventoryRoutes = require("./routes/inventoryRoutes");
app.use("/api/inventory", inventoryRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
