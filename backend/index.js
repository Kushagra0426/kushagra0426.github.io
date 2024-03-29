const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors'); // Import cors
const userAgent = require('express-useragent'); // Import express-useragent
const env = require('dotenv').config();
const path = require('path'); // Add this line to import the 'path' module

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors()); // Use cors middleware
app.use(userAgent.express()); // Use express-useragent middleware

const userName = env.parsed.username
const passWord = env.parsed.password
const receiverEmail = env.parsed.receiver_email

app.post('/userDetails', async (req, res) => {
    const { name, organization } = req.body;

    const userInfo = {
        platform: req.useragent.platform,
        type: req.useragent.isDesktop ? 'Desktop' : req.useragent.isTablet ? 'Tablet' : 'Mobile',
        browser: req.useragent.browser,
        version: req.useragent.version,
        osVersion: req.useragent.os,
        architecture: req.useragent.is64bit ? 'x64' : 'x86'
    };

    // Set up Nodemailer transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: userName,
            pass: passWord
        }
    });

    // Email content
    const mailOptions = {
        from: userName,
        to: receiverEmail,
        subject: 'User Visit Notification',
        text: `A user named ${name} from ${organization} organization visited your website.\nUser Info:\nIP Address: ${req.ip}\nTimestamp: ${new Date()}\n${JSON.stringify(userInfo, null, 2)}`
    };

    try {
        // Send email
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'User details and notification email sent successfully.' });
    } catch (error) {
        console.error('Error sending user details and notification email:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/contact', async (req, res) => {
    const { username, email, subject, message } = req.body;

    // Set up Nodemailer transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: userName, // Replace with your Gmail email address
            pass: passWord // Use the App Password generated for your Gmail account
        }
    });

    // Email content
    const mailOptions = {
        from: email,
        to: receiverEmail, // Replace with your email address
        subject: subject,
        text: `Name: ${username}\nEmail: ${email}\n\nMessage:\n${message}`
    };

    try {
        // Send email
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/sendNoti', async (req, res) => {
    // Extract user agent information
    const userInfo = {
        platform: req.useragent.platform,
        type: req.useragent.isDesktop ? 'Desktop' : req.useragent.isTablet ? 'Tablet' : 'Mobile',
        browser: req.useragent.browser,
        version: req.useragent.version,
        osVersion: req.useragent.os,
        architecture: req.useragent.is64bit ? 'x64' : 'x86'
    };

    // Set up Nodemailer transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: userName, // Replace with your Gmail email address
            pass: passWord // Use the App Password generated for your Gmail account
        }
    });

    // Email content
    const mailOptions = {
        from: userName, // Replace with your email address
        to: receiverEmail, // Replace with your email address
        subject: 'User Visit Notification',
        text: `Hello,\n\nA user visited your website.\nUser Info:\nIP Address: ${req.ip}\nTimestamp: ${new Date()}\n${JSON.stringify(userInfo, null, 2)}`
    };

    try {
        // Send email
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Notification email sent successfully.' });
    } catch (error) {
        console.error('Error sending notification email:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const indexPath = path.join(__dirname, '../index.html');

app.get('/', (req, res) => {
    res.sendFile(indexPath);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
