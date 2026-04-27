const prisma = require("../../db_query/prisma");
const fs = require("fs");
const path = require("path");

const filePathFromPublicUrl = (url) => {
  if (!url || !url.includes("/uploads/")) return null;
  const uploadPath = url.split("/uploads/")[1];
  if (!uploadPath) return null;
  return path.join(__dirname, "../../../uploads", uploadPath);
};

const toPublicImageUrl = (req, file) => `${req.protocol}://${req.get("host")}/uploads/partner/${file.filename}`;
const MAX_PARTNER_DESCRIPTION = 190;

const toTrimmedOrNull = (value) => {
  if (value === undefined) return undefined;
  if (value === null) return null;
  const t = String(value).trim();
  return t ? t : null;
};

const validatePartnerDescription = (value) => {
  if (value == null) return;
  if (value.length > MAX_PARTNER_DESCRIPTION) {
    const err = new Error(
      `Description is too long. Maximum ${MAX_PARTNER_DESCRIPTION} characters allowed.`
    );
    err.statusCode = 400;
    throw err;
  }
};

const listPartnersAdmin = async (req, res, next) => {
  try {
    const data = await prisma.partner.findMany({
      orderBy: [{ priority: "desc" }, { updatedAt: "desc" }],
    });
    res.status(200).json({ success: true, data });
  } catch (e) {
    next(e);
  }
};

const createPartner = async (req, res, next) => {
  try {
    const {
      name,
      websiteUrl,
      description,
      industry,
      contactEmail,
      contactPhone,
      address,
      active,
      priority,
    } = req.body;
    const logo = req.file ? toPublicImageUrl(req, req.file) : null;
    if (!logo) return res.status(400).json({ success: false, message: "Partner logo is required" });
    const safeDescription = toTrimmedOrNull(description);
    validatePartnerDescription(safeDescription);
    const created = await prisma.partner.create({
      data: {
        name: String(name || "").trim(),
        logoUrl: logo,
        websiteUrl: toTrimmedOrNull(websiteUrl),
        description: safeDescription,
        industry: toTrimmedOrNull(industry),
        contactEmail: toTrimmedOrNull(contactEmail),
        contactPhone: toTrimmedOrNull(contactPhone),
        address: toTrimmedOrNull(address),
        active: active === undefined ? true : active === true || String(active) === "true",
        priority: Number.isFinite(Number(priority)) ? Number(priority) : 0,
      },
    });
    res.status(201).json({ success: true, data: created });
  } catch (e) {
    if (e?.code === "P2000") {
      return res.status(400).json({
        success: false,
        message: "One or more fields are too long for Partner. Please shorten text and try again.",
      });
    }
    next(e);
  }
};

const updatePartner = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      websiteUrl,
      description,
      industry,
      contactEmail,
      contactPhone,
      address,
      active,
      priority,
    } = req.body;
    const patch = {};
    const existing = await prisma.partner.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ success: false, message: "Partner not found" });
    if (name !== undefined) patch.name = String(name || "").trim();
    if (req.file) {
      patch.logoUrl = toPublicImageUrl(req, req.file);
      const oldFilePath = filePathFromPublicUrl(existing.logoUrl);
      if (oldFilePath && fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath);
    }
    if (websiteUrl !== undefined) patch.websiteUrl = toTrimmedOrNull(websiteUrl);
    if (description !== undefined) {
      patch.description = toTrimmedOrNull(description);
      validatePartnerDescription(patch.description);
    }
    if (industry !== undefined) patch.industry = toTrimmedOrNull(industry);
    if (contactEmail !== undefined) patch.contactEmail = toTrimmedOrNull(contactEmail);
    if (contactPhone !== undefined) patch.contactPhone = toTrimmedOrNull(contactPhone);
    if (address !== undefined) patch.address = toTrimmedOrNull(address);
    if (active !== undefined) patch.active = active === true || String(active) === "true";
    if (priority !== undefined) patch.priority = Number.isFinite(Number(priority)) ? Number(priority) : 0;
    const updated = await prisma.partner.update({ where: { id }, data: patch });
    res.status(200).json({ success: true, data: updated });
  } catch (e) {
    if (e?.code === "P2000") {
      return res.status(400).json({
        success: false,
        message: "One or more fields are too long for Partner. Please shorten text and try again.",
      });
    }
    next(e);
  }
};

const deletePartner = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await prisma.partner.findUnique({ where: { id } });
    await prisma.partner.delete({ where: { id } });
    const oldFilePath = filePathFromPublicUrl(existing?.logoUrl);
    if (oldFilePath && fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath);
    res.status(200).json({ success: true, message: "Partner deleted" });
  } catch (e) {
    next(e);
  }
};

module.exports = { listPartnersAdmin, createPartner, updatePartner, deletePartner };
