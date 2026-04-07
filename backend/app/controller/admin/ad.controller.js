const fs = require("fs");
const adService = require("../../services/ad.service");
const { AD_SLOT_PRESETS } = require("../../constants/adSlots");

const listAds = async (req, res, next) => {
  try {
    const ads = await adService.listAds({ slotKey: req.query.slotKey });
    res.status(200).json({ success: true, data: ads, presets: AD_SLOT_PRESETS });
  } catch (e) {
    next(e);
  }
};

/** POST multipart: fields + image (file field name: image) */
const createAd = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image file is required" });
    }
    const body = req.body || {};
    const ad = await adService.createAd(body, req.file, req.adId);
    res.status(201).json({ success: true, data: ad });
  } catch (e) {
    if (req.adId) adService.deleteAdImageFiles(req.adId);
    next(e);
  }
};

/**
 * PATCH: JSON (toggle active, metadata) or multipart with new image.
 * Multipart: same field names; include image file to replace creative (old files removed).
 */
const updateAd = async (req, res, next) => {
  try {
    const body = { ...req.body };
    const ad = await adService.updateAd(req.params.id, body, req.file || null);
    res.status(200).json({ success: true, data: ad });
  } catch (e) {
    if (req.file?.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (_) {
        /* ignore */
      }
    }
    next(e);
  }
};

const deleteAd = async (req, res, next) => {
  try {
    await adService.deleteAd(req.params.id);
    res.status(200).json({ success: true });
  } catch (e) {
    next(e);
  }
};

module.exports = { listAds, createAd, updateAd, deleteAd };
