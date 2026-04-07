const adService = require("../../services/ad.service");
const { AD_SLOT_PRESETS } = require("../../constants/adSlots");

function publicMediaBase() {
  const fromEnv = process.env.PUBLIC_MEDIA_BASE;
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  const port = process.env.PORT || 5000;
  return `http://127.0.0.1:${port}`;
}

function withAbsoluteImageUrl(ad) {
  if (!ad || !ad.imageUrl) return ad;
  const u = ad.imageUrl;
  if (/^https?:\/\//i.test(u)) return ad;
  const base = publicMediaBase();
  const pathPart = u.startsWith("/") ? u : `/${u}`;
  return { ...ad, imageUrl: `${base}${pathPart}` };
}

const getAdBySlot = async (req, res, next) => {
  try {
    const slotKey = req.query.slotKey;
    const ad = await adService.getActiveAdForSlot(slotKey);
    res.status(200).json({ success: true, data: ad ? withAbsoluteImageUrl(ad) : null });
  } catch (e) {
    next(e);
  }
};

const getAdSlotPresets = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, data: AD_SLOT_PRESETS });
  } catch (e) {
    next(e);
  }
};

module.exports = { getAdBySlot, getAdSlotPresets };
