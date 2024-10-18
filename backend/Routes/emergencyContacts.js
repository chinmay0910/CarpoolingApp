const express = require("express");
const { isSignedin } = require("../Controllers/authenticate");
const {
    addEmergencyContact,
    getEmergencyContacts,
    deleteEmergencyContact
} = require("../Controllers/emergencyContact");

const router = express.Router();

// Route to add an emergency contact
router.post("/", isSignedin, addEmergencyContact); // Swagger API pending

// Route to get all emergency contacts
router.get("/", isSignedin, getEmergencyContacts); // Swagger API pending

// Route to delete an emergency contact
router.delete("/:id", isSignedin, deleteEmergencyContact); // Swagger API pending

module.exports = router;
