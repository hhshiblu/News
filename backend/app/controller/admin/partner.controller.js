const prisma = require("../../db_query/prisma");

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
    const { name, logoUrl, websiteUrl, active, priority } = req.body;
    const created = await prisma.partner.create({
      data: {
        name: String(name || "").trim(),
        logoUrl: String(logoUrl || "").trim(),
        websiteUrl: websiteUrl ? String(websiteUrl).trim() : null,
        active: active === undefined ? true : active === true || String(active) === "true",
        priority: Number.isFinite(Number(priority)) ? Number(priority) : 0,
      },
    });
    res.status(201).json({ success: true, data: created });
  } catch (e) {
    next(e);
  }
};

const updatePartner = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, logoUrl, websiteUrl, active, priority } = req.body;
    const patch = {};
    if (name !== undefined) patch.name = String(name || "").trim();
    if (logoUrl !== undefined) patch.logoUrl = String(logoUrl || "").trim();
    if (websiteUrl !== undefined) patch.websiteUrl = websiteUrl ? String(websiteUrl).trim() : null;
    if (active !== undefined) patch.active = active === true || String(active) === "true";
    if (priority !== undefined) patch.priority = Number.isFinite(Number(priority)) ? Number(priority) : 0;
    const updated = await prisma.partner.update({ where: { id }, data: patch });
    res.status(200).json({ success: true, data: updated });
  } catch (e) {
    next(e);
  }
};

const deletePartner = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.partner.delete({ where: { id } });
    res.status(200).json({ success: true, message: "Partner deleted" });
  } catch (e) {
    next(e);
  }
};

module.exports = { listPartnersAdmin, createPartner, updatePartner, deletePartner };
