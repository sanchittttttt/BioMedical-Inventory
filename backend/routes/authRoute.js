const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
require("dotenv").config();

const router = express.Router();

// REGISTER USER
router.post("/register", async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    // Check if user already exists
    const [existingUser] = await db.query("SELECT * FROM users WHERE username = ?", [username]);
    if (existingUser.length > 0) {
      return res.status(400).json({  error: "User already exists." });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user into DB
    const result = await db.query(
      "INSERT INTO users (username, password, role) VALUES (?, ?, ?)", 
      [username, hashedPassword, role || "staff"]
    );

    const userId = result[0].insertId; // Get newly inserted user ID

    res.status(201).json({ message: "User registered successfully.", userId });
  } catch (error) {
    console.error("❌ Error registering user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// LOGIN USER
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required." });
  }

  try {
    // Find user in DB
    const [user] = await db.query("SELECT id, username, password, role FROM users WHERE username = ?", [username]);
    if (user.length === 0) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const validPassword = await bcrypt.compare(password, user[0].password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    // Generate JWT Token with user ID
    const token = jwt.sign(
      { id: user[0].id, username: user[0].username, role: user[0].role }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token, userId: user[0].id });
  } catch (error) {
    console.error("❌ Error logging in:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
