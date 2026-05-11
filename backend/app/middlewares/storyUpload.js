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

const ALLOWED_IMAGE_MIMES = new Set([
    'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif',
]);

const storyUpload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    fileFilter: (_req, file, cb) => {
        if (ALLOWED_IMAGE_MIMES.has(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only JPEG, PNG, WebP, GIF, or AVIF images are allowed for story thumbnails.'), false);
        }
    }
});

module.exports = storyUpload;
