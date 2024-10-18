const multer = require('multer');
const path = require('path');

// Set storage options for Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');  // Save to the 'uploads' directory
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));  // Save with unique name
    }
});

// Filter to ensure that only audio files are uploaded
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['audio/webm', 'audio/mpeg', 'audio/wav']; // Add other audio types as needed
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true); // Accept the file
    } else {
      cb(new Error('Only audio files are allowed!'), false); // Reject the file
    }
  };

// Multer configuration
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 50 * 1024 * 1024 }  // 10 MB limit for audio files
});

module.exports = upload;
