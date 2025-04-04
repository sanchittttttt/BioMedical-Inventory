const express = require("express");
const db = require("../server"); // ✅ Use `server.js`
const verifyToken = require("../middleware/authMiddleware");
const sendLowStockAlert = require("../emailService"); // Import email function

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
router.post("/items", verifyToken, (req, res) => {
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

// PUT route to update an item's quantity and trigger low stock alert
router.put("/items/:id", verifyToken, (req, res) => {
    const itemId = req.params.id;
    const { quantity } = req.body;

    const sql = "UPDATE inventory SET quantity = ? WHERE id = ?";
    db.query(sql, [quantity, itemId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Database error" });
        }

        // Fetch the item name to include in the alert
        db.query("SELECT item_name FROM inventory WHERE id = ?", [itemId], (err, rows) => {
            if (!err && rows.length > 0) {
                const itemName = rows[0].item_name;
                let message = `Inventory updated successfully: ${itemName} now has ${quantity} in stock.`;

                // If stock is low, send an email and update message
                if (quantity <= 10) {
                    sendLowStockAlert(itemName, quantity);
                    message += " ⚠️ Low stock alert (email sent!)";
                }

                return res.json({ message });
            } else {
                return res.status(404).json({ error: "Item not found" });
            }
        });
    });
});

// DELETE route to remove an item by item_name
router.delete("/items/:item_name", verifyToken, (req, res) => {
    const itemName = req.params.item_name;

    const sql = "DELETE FROM inventory WHERE item_name = ?";
    db.query(sql, [itemName], (err, result) => {
        if (err) {
            console.error("Error deleting item:", err);
            return res.status(500).json({ error: "Database error" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Item not found" });
        }

        res.json({ message: `Item '${itemName}' deleted successfully.` });
    });
});


module.exports = router;
