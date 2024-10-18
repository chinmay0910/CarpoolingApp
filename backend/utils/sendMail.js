// utils/sendCredentials.js
const nodemailer = require('nodemailer');
require('dotenv').config();
const path = require('path');

const sendCredentials = (receiver, subject, body, audioFilePath) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.USER,       // Your email
            pass: process.env.APP_PASS    // Your app password
        },
    });

    const mailOptions = {
        from: {
            name: "SOS Alert System",
            address: process.env.USER
        },
        to: receiver,
        subject: subject,
        text: body,
        attachments:audioFilePath ? [
            {
                filename: path.basename(audioFilePath),  // Name of the file in the attachment
                path: audioFilePath                     // Path to the audio file
            }
        ] : []
    };

    const sendMail = async () => {
        try {
            await transporter.sendMail(mailOptions);
            console.log("Email sent successfully to:", receiver);
        } catch (error) {
            console.error("Error sending email:", error);
        }
    };

    sendMail();
};

module.exports = sendCredentials;
