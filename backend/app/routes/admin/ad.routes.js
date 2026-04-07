const express = require("express");
const { listAds, createAd, updateAd, deleteAd } = require("../../controller/admin/ad.controller");
const { protect, authorize } = require("../../middlewares/auth.middleware");
const {
  assignNewAdId,
  uploadAdImageCreate,
  uploadAdImageUpdate,
} = require("../../middlewares/adImageUpload.middleware");

const router = express.Router();
router.use(protect, authorize("ADMIN"));

router.get("/", listAds);
router.post("/", assignNewAdId, uploadAdImageCreate.single("image"), createAd);

function multipartPatchIfNeeded(req, res, next) {
  const ct = req.headers["content-type"] || "";
  if (ct.includes("multipart/form-data")) {
    return uploadAdImageUpdate.single("image")(req, res, next);
  }
  next();
}

router.patch("/:id", multipartPatchIfNeeded, updateAd);
router.delete("/:id", deleteAd);

module.exports = router;
