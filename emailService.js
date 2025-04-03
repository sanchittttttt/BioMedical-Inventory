const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "sbcv32@gmail.com",
        pass: "blic teyf arqj cxck", // Use an app password for security
    }
});

const sendLowStockAlert = (itemName, quantity) => {
    const mailOptions = {
        from: "sbcv32@gmail.com",
        to: "sbcv32@gmail.com",
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
