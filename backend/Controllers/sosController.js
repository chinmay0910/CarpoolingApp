const EmergencyContact = require('../Models/EmergencyContact');
const sendCredentials = require('../utils/sendMail');
const path = require('path');
const fs = require('fs');
const user = require('../Models/user');

// Controller to handle SOS request with file upload
exports.handleSOS = async (req, res) => {
    try {
        const { location, coords } = req.body;  // Extract location and coordinates
        const userId = req.auth._id;  // Assume user authentication middleware sets req.auth._id
        const audioFile = req.file;  // Multer adds the file to the req object

        if (!audioFile) {
            return res.status(400).json({ message: 'Audio file is required.' });
        }

        // Fetch emergency contacts for the user
        const emergencyContacts = await EmergencyContact.find({ userId });
        const user = await user.findById(userId);

        if (!emergencyContacts.length) {
            return res.status(404).json({ message: 'No emergency contacts found for this user.' });
        }

        // Send SOS emails to each emergency contact
        emergencyContacts.forEach(contact => {
            const subject = "SOS Alert: Immediate Attention Needed";
            const body = `
                Dear ${contact.name},

                An SOS alert has been triggered by ${user.name}.
                
                Location: ${location}
                Coordinates: (${coords.lat}, ${coords.lng})
                
                Audio Recording Attached.
                
                Please check on their well-being immediately.

                Best regards,
                SOS System
            `;

            // Call the mailer function to send the email with the audio file attachment
            sendCredentials(contact.emailId, subject, body, audioFile.path);
        });

        res.status(200).json({ message: 'SOS alerts sent successfully.' });
    } catch (error) {
        console.error('Error in sending SOS:', error);
        res.status(500).json({ error: 'An error occurred while sending SOS.' });
    }
};
