const path = require("path");
const fs = require("fs");
const prisma = require("../db_query/prisma");
const { isValidSlotKey } = require("../constants/adSlots");

const adsDir = path.join(__dirname, "../../uploads/ads");
const AD_CACHE_TTL_MS = 15000;
const adSlotCache = new Map();

function clearAdCache(slotKey) {
  if (slotKey) {
    adSlotCache.delete(slotKey);
    return;
  }
  adSlotCache.clear();
}

function deleteAdImageFiles(adId) {
  if (!adId || !fs.existsSync(adsDir)) return;
  const files = fs.readdirSync(adsDir);
  for (const f of files) {
    if (f === adId || f.startsWith(`${adId}.`)) {
      try {
        fs.unlinkSync(path.join(adsDir, f));
      } catch (_) {
        /* ignore */
      }
    }
  }
}

function imageUrlForId(adId, ext) {
  return `/uploads/ads/${adId}${ext}`;
}

async function getActiveAdForSlot(slotKey) {
  if (!isValidSlotKey(slotKey)) return null;
  const cached = adSlotCache.get(slotKey);
  if (cached && cached.expiresAt > Date.now()) return cached.data;

  const ad = await prisma.advertisement.findFirst({
    where: { slotKey, active: true },
    orderBy: [{ priority: "desc" }, { updatedAt: "desc" }],
  });

  adSlotCache.set(slotKey, {
    data: ad,
    expiresAt: Date.now() + AD_CACHE_TTL_MS,
  });

  return ad;
}

async function listAds({ slotKey } = {}) {
  const where = {};
  if (slotKey && isValidSlotKey(slotKey)) where.slotKey = slotKey;
  return prisma.advertisement.findMany({
    where,
    orderBy: [{ slotKey: "asc" }, { priority: "desc" }, { updatedAt: "desc" }],
  });
}

async function createAd(data, file, adId) {
  if (!isValidSlotKey(data.slotKey)) {
    throw new Error("Invalid ad slot");
  }
  if (!file) throw new Error("Image file required");
  const id = adId;
  const ext = path.extname(file.filename);

  const width = Math.min(2000, Math.max(1, parseInt(data.width, 10) || 300));
  const height = Math.min(2000, Math.max(1, parseInt(data.height, 10) || 250));
  const priority = Math.min(9999, Math.max(0, parseInt(data.priority, 10) || 0));
  const imageUrl = imageUrlForId(id, ext);
  const created = await prisma.advertisement.create({
    data: {
      id,
      slotKey: data.slotKey,
      width,
      height,
      imageUrl,
      companyName: data.companyName ? String(data.companyName).trim() : null,
      targetUrl: data.targetUrl ? String(data.targetUrl).trim() : null,
      active:
        data.active === undefined || data.active === null
          ? true
          : data.active === true || String(data.active) === "true",
      priority,
    },
  });
  clearAdCache(data.slotKey);
  return created;
}

async function updateAd(id, data, file) {
  const existing = await prisma.advertisement.findUnique({ where: { id } });
  if (!existing) throw new Error("Ad not found");

  const patch = {};
  if (data.width !== undefined) patch.width = Math.min(2000, Math.max(1, parseInt(data.width, 10) || 300));
  if (data.height !== undefined) patch.height = Math.min(2000, Math.max(1, parseInt(data.height, 10) || 250));
  if (data.companyName !== undefined) patch.companyName = data.companyName ? String(data.companyName).trim() : null;
  if (data.targetUrl !== undefined) patch.targetUrl = data.targetUrl ? String(data.targetUrl).trim() : null;
  if (data.active !== undefined) {
    patch.active = data.active === true || String(data.active) === "true";
  }
  if (data.priority !== undefined) patch.priority = Math.min(9999, Math.max(0, parseInt(data.priority, 10) || 0));
  if (data.slotKey !== undefined) {
    if (!isValidSlotKey(data.slotKey)) throw new Error("Invalid ad slot");
    patch.slotKey = data.slotKey;
  }

  if (file) {
    const ext = path.extname(file.filename);
    const basename = `${id}${ext}`;
    if (fs.existsSync(adsDir)) {
      const files = fs.readdirSync(adsDir);
      for (const f of files) {
        if ((f.startsWith(`${id}.`) || f === id) && f !== basename) {
          try {
            fs.unlinkSync(path.join(adsDir, f));
          } catch (_) {
            /* ignore */
          }
        }
      }
    }
    patch.imageUrl = imageUrlForId(id, ext);
  }

  const updated = await prisma.advertisement.update({
    where: { id },
    data: patch,
  });
  clearAdCache(existing.slotKey);
  if (patch.slotKey && patch.slotKey !== existing.slotKey) {
    clearAdCache(patch.slotKey);
  }
  return updated;
}

async function deleteAd(id) {
  const existing = await prisma.advertisement.findUnique({
    where: { id },
    select: { slotKey: true },
  });
  deleteAdImageFiles(id);
  const deleted = await prisma.advertisement.delete({ where: { id } });
  clearAdCache(existing?.slotKey);
  return deleted;
}

module.exports = {
  getActiveAdForSlot,
  listAds,
  createAd,
  updateAd,
  deleteAd,
  deleteAdImageFiles,
};
