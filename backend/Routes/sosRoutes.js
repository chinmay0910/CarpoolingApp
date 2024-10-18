const express = require('express');
const router = express.Router();
const { handleSOS } = require('../Controllers/sosController');
const upload = require('../middleware/uploadAudio');  // Import the Multer middleware
const { isSignedin } = require("../Controllers/authenticate");

// Route to handle SOS alert with audio file upload
router.post('/sos', isSignedin, upload.single('audio'), handleSOS);  // Expect 'audio' field in the form-data

module.exports = router;
