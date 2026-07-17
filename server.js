const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Configure Multer to hold the CV in memory 
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Configure Google Workspace SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, 
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

// =========================================
// ROUTE 1: General Contact Form
// =========================================
app.post('/api/contact', async (req, res) => {
  // Removed 'phone' to match your HTML form
  const { name, email, message } = req.body;

  try {
    // 1. Send inquiry to the business
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER,
      replyTo: email,
      subject: `New Care Inquiry from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    });

    // 2. Send auto-reply to the client
    await transporter.sendMail({
      from: process.env.GMAIL_USER, // FIXED: Changed from IONOS to GMAIL
      to: email,
      subject: 'Thank you for contacting Platinum Carers',
      text: `Dear ${name},\n\nThank you for getting in touch. A member of our care team will review your inquiry and contact you shortly.\n\nWarm regards,\nThe Team at Platinum Carers Ltd`
    });

    res.redirect('/success.html');
  } catch (error) {
    console.error("Contact Form Error:", error);
    res.status(500).send('Error sending message. Please try again.');
  }
});

// =========================================
// ROUTE 2: Job Application (With CV Upload)
// =========================================
app.post('/api/apply', upload.single('cv'), async (req, res) => {
  // Removed 'role' to match your HTML form
  const { name, email, phone } = req.body;
  const cvFile = req.file;

  try {
    // 1. Send application and CV to the business
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER,
      replyTo: email,
      subject: `New Job Application: ${name}`, // Removed role from subject
      text: `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\n\nPlease find the applicant's CV attached.`,
      attachments: cvFile ? [
        {
          filename: cvFile.originalname,
          content: cvFile.buffer
        }
      ] : []
    });

    // 2. Send auto-reply to the applicant
    await transporter.sendMail({
      from: process.env.GMAIL_USER, // FIXED: Changed from IONOS to GMAIL
      to: email,
      subject: 'Application Received - Platinum Carers',
      text: `Dear ${name},\n\nThank you for applying to join the Platinum Carers team. We have successfully received your application and CV.\n\nOur recruitment team will review your details and contact you if you are selected for an interview.\n\nWarm regards,\nPlatinum Carers Ltd`
    });

    res.redirect('/success.html');
  } catch (error) {
    console.error("Application Error:", error);
    res.status(500).send('Error submitting application. Please try again.');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));