const multer = require("multer");
const path = require("path");
const fs = require("fs");

const teamDir = path.join(__dirname, "../../uploads/team");
const partnerDir = path.join(__dirname, "../../uploads/partner");

if (!fs.existsSync(teamDir)) fs.mkdirSync(teamDir, { recursive: true });
if (!fs.existsSync(partnerDir)) fs.mkdirSync(partnerDir, { recursive: true });

const allowedExt = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

const normalizeExt = (name = "") => {
  const ext = path.extname(name).toLowerCase();
  return allowedExt.has(ext) ? ext : ".jpg";
};

const safeName = (prefix, ext) => `${prefix}-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;

const imageFilter = (_req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) return cb(new Error("Only image uploads are allowed"));
  cb(null, true);
};

const teamStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, teamDir),
  filename: (_req, file, cb) => cb(null, safeName("team", normalizeExt(file.originalname))),
});

const partnerStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, partnerDir),
  filename: (_req, file, cb) => cb(null, safeName("partner", normalizeExt(file.originalname))),
});

const uploadTeamImage = multer({
  storage: teamStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const uploadPartnerLogo = multer({
  storage: partnerStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = {
  uploadTeamImage,
  uploadPartnerLogo,
};
