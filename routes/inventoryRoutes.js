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

// POST route to add an item
router.post("/items", (req, res) => {
    const { item_name, quantity, expiry_date } = req.body;

    const sql = "INSERT INTO inventory (item_name, quantity, expiry_date) VALUES (?, ?, ?)";
    db.query(sql, [item_name, quantity, expiry_date], (err, result) => {
        if (err) {
            console.error("Error inserting item:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.status(201).json({ message: "Item added successfully", id: result.insertId });
    });
});

// Low Stock Alert Route
router.get("/low-stock", (req, res) => {
    const threshold = 10; // Define low stock threshold

    const query = "SELECT * FROM inventory WHERE quantity <= ?";
    db.query(query, [threshold], (err, results) => {
        if (err) {
            console.error("Error fetching low stock items:", err);
            return res.status(500).json({ error: "Database error" });
        }

        if (results.length === 0) {
            return res.json({ message: "No low stock items" });
        }

        res.json({ lowStockItems: results });
    });
});


module.exports = router;
