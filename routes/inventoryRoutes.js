const express = require("express");
const db = require("../server"); // ✅ Use `server.js` instead of `db.js`
const verifyToken = require("../middleware/authMiddleware");
const router = express.Router();

// Get all inventory items
router.get("/items", verifyToken, (req, res) => {
    db.query("SELECT * FROM inventory", (err, results) => {
        if (err) {
            console.error("Error retrieving inventory:", err);
            return res.status(500).json({ message: "Database error" });
        }
        res.json(results);
    });
});

// Add item to inventory
router.post("/items", verifyToken, (req, res) => {
    const { item_name, quantity, expiry_date } = req.body;

    if (!item_name || !quantity || !expiry_date) {
        return res.status(400).json({ message: "Please provide item_name, quantity, and expiry_date." });
    }

    const sql = "INSERT INTO inventory (item_name, quantity, expiry_date) VALUES (?, ?, ?)";
    db.query(sql, [item_name, quantity, expiry_date], (err, result) => {
        if (err) {
            console.error("Error inserting inventory item:", err);
            return res.status(500).json({ message: "Database error" });
        }
        res.status(201).json({ message: "Item added successfully", itemId: result.insertId });
    });
});



module.exports = router;
