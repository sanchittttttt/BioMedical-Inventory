const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ message: "Access Denied. No token provided." });
    }

    try {
        const verified = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
        req.user = verified; // Attach user data to request
        next(); // Move to the next middleware or route
    } catch (err) {
        res.status(403).json({ message: "Invalid token" });
    }
};

module.exports = verifyToken;
