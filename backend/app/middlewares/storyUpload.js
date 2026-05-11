const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure story uploads directory exists
const dirStories = path.join(__dirname, '../../uploads/stories');
if (!fs.existsSync(dirStories)) fs.mkdirSync(dirStories, { recursive: true });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, dirStories);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'story-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const storyUpload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed for story thumbnails!'), false);
        }
    }
});

module.exports = storyUpload;
