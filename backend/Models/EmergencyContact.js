const mongoose = require('mongoose');

const emergencyContactSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    emailId: { type: String, required: true }, // New field for emailId
    name: { type: String, required: true },
    relationship: { type: String, required: true },
    phone: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('EmergencyContact', emergencyContactSchema);
