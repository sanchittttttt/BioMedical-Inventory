require("dotenv").config(); // Load environment variables

const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./config/db");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const authRoutes = require("./routes/authRoute");
app.use("/api/auth", authRoutes);

// ✅ Load & execute SQL schema file safely
const setupDatabase = async () => {
  try {
    const schemaPath = path.join(__dirname, "database", "schema.sql");

    if (!fs.existsSync(schemaPath)) {
      console.warn("⚠️ schema.sql file is missing. Skipping execution.");
      return;
    }

    const schemaSQL = fs.readFileSync(schemaPath, { encoding: "utf8" }).trim();
    if (!schemaSQL) {
      console.warn("⚠️ schema.sql file is empty. Skipping execution.");
      return;
    }

    await db.query(schemaSQL);
    console.log("✅ Database setup completed.");
  } catch (error) {
    console.error("❌ Error setting up database:", error);
  }
};

// ✅ Run database setup but allow the server to start even if it fails
setupDatabase().catch(err => console.error("Database setup failed:", err));

app.get("/", (req, res) => {
  res.send("Biomedical Inventory API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
