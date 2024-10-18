// controllers/emergencyContact.js
const EmergencyContact = require("../Models/EmergencyContact"); // Assuming the model is in the models folder
const User = require("../Models/user"); // Adjust according to your structure

// Add an emergency contact
const addEmergencyContact = async (req, res) => {
    try {
        const { name, relationship, phone, emailId } = req.body;
        const user = await User.findById(req.auth._id);
        
        const newContact = new EmergencyContact({
            userId: user._id,
            emailId,
            name,
            relationship,
            phone,
        });

        await newContact.save();
        return res.status(201).json(newContact);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred while adding the contact." });
    }
};

// Get all emergency contacts
const getEmergencyContacts = async (req, res) => {
    try {
        // console.log(req.auth._id);
        
        const contacts = await EmergencyContact.find({ userId: req.auth._id });
        return res.status(200).json(contacts);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred while fetching contacts." });
    }
};

// Delete an emergency contact
const deleteEmergencyContact = async (req, res) => {
    try {
        const { id } = req.params;
        await EmergencyContact.findByIdAndDelete(id);
        return res.status(204).json(); // No content response
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred while deleting the contact." });
    }
};

module.exports = {
    addEmergencyContact,
    getEmergencyContacts,
    deleteEmergencyContact,
};
