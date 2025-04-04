const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    }
});

const sendLowStockAlert = (itemName, quantity) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_TO,
        subject: `⚠ Low Stock Alert: ${itemName}`,
        html: `
            <h2 style="color: red;">🚨 Low Stock Alert! 🚨</h2>
            <p><strong>Item:</strong> ${itemName}</p>
            <p><strong>Remaining Stock:</strong> ${quantity} units</p>
            <p style="color: red;">Please restock soon to avoid shortages.</p>
            <hr>
            <p>Best,<br>Biomedical Inventory System</p>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email:", error);
        } else {
            console.log("Low stock alert email sent:", info.response);
        }
    });
};

module.exports = sendLowStockAlert;
