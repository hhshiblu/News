const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { randomUUID } = require("crypto");

const adsDir = path.join(__dirname, "../../uploads/ads");
if (!fs.existsSync(adsDir)) fs.mkdirSync(adsDir, { recursive: true });

const ALLOWED_EXT = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp"]);

function normalizeExt(originalname) {
  const ext = path.extname(originalname || "").toLowerCase();
  return ALLOWED_EXT.has(ext) ? ext : ".jpg";
}

/** Ensure Prisma row id exists before multer runs (POST create). */
function assignNewAdId(req, res, next) {
  req.adId = randomUUID();
  next();
}

const storageCreate = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, adsDir),
  filename: (req, file, cb) => {
    const ext = normalizeExt(file.originalname);
    cb(null, `${req.adId}${ext}`);
  },
});

const storageUpdate = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, adsDir),
  filename: (req, file, cb) => {
    const ext = normalizeExt(file.originalname);
    cb(null, `${req.params.id}${ext}`);
  },
});

const uploadAdImageCreate = multer({
  storage: storageCreate,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image uploads are allowed"));
    }
    cb(null, true);
  },
});

const uploadAdImageUpdate = multer({
  storage: storageUpdate,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image uploads are allowed"));
    }
    cb(null, true);
  },
});

module.exports = {
  adsDir,
  assignNewAdId,
  uploadAdImageCreate,
  uploadAdImageUpdate,
  normalizeExt,
};
