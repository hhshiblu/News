const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure directories exist programmatically as a fallback
const dirImages = path.join(__dirname, '../../../uploads/news/images');
const dirVideos = path.join(__dirname, '../../../uploads/news/videos');
if (!fs.existsSync(dirImages)) fs.mkdirSync(dirImages, { recursive: true });
if (!fs.existsSync(dirVideos)) fs.mkdirSync(dirVideos, { recursive: true });

const ALLOWED_IMAGE_MIMES = new Set([
    'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif',
]);
const ALLOWED_VIDEO_MIMES = new Set([
    'video/mp4', 'video/webm', 'video/ogg', 'video/quicktime',
]);
const ALLOWED_EXTS = new Set([
    '.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif',
    '.mp4', '.webm', '.ogg', '.mov',
]);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.mimetype.startsWith('video/')) {
            cb(null, dirVideos);
        } else {
            cb(null, dirImages);
        }
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname).toLowerCase());
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 20 * 1024 * 1024, // 20 MB max for news images/videos
    },
    fileFilter: (_req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const mimeOk = ALLOWED_IMAGE_MIMES.has(file.mimetype) || ALLOWED_VIDEO_MIMES.has(file.mimetype);
        const extOk = ALLOWED_EXTS.has(ext);
        if (!mimeOk || !extOk) {
            return cb(new Error('Only image (JPEG/PNG/WebP/GIF/AVIF) and video (MP4/WebM/OGG/MOV) files are allowed.'), false);
        }
        cb(null, true);
    },
});

const uploadFile = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file provided.' });
        }

        const type = req.file.mimetype.startsWith('video/') ? 'videos' : 'images';
        const fileUrl = `/uploads/news/${type}/${req.file.filename}`;

        res.status(201).json({
            success: true,
            message: 'File uploaded successfully',
            url: fileUrl
        });
    } catch(err) {
        next(err);
    }
};

module.exports = {
    upload,
    uploadFile
};
