const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure directories exist programmatically as a fallback
const dirImages = path.join(__dirname, '../../../uploads/news/images');
const dirVideos = path.join(__dirname, '../../../uploads/news/videos');
if (!fs.existsSync(dirImages)) fs.mkdirSync(dirImages, { recursive: true });
if (!fs.existsSync(dirVideos)) fs.mkdirSync(dirVideos, { recursive: true });

// Multer Disk Storage Configuration
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
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

const uploadFile = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file provided.' });
        }

        // Return relative path for db storage
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
