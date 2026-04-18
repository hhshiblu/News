const prisma = require("../../db_query/prisma");
const fs = require("fs");
const path = require("path");

const filePathFromPublicUrl = (url) => {
  if (!url || !url.includes("/uploads/")) return null;
  const uploadPath = url.split("/uploads/")[1];
  if (!uploadPath) return null;
  return path.join(__dirname, "../../../uploads", uploadPath);
};

const toPublicImageUrl = (req, file) => `${req.protocol}://${req.get("host")}/uploads/team/${file.filename}`;

const listTeamMembersAdmin = async (req, res, next) => {
  try {
    const data = await prisma.teamMember.findMany({
      orderBy: [{ priority: "desc" }, { updatedAt: "desc" }],
    });
    res.status(200).json({ success: true, data });
  } catch (e) {
    next(e);
  }
};

const createTeamMember = async (req, res, next) => {
  try {
    const {
      name,
      role,
      description,
      email,
      phone,
      department,
      location,
      experienceYears,
      skills,
      active,
      priority,
    } = req.body;
    const imageUrl = req.file ? toPublicImageUrl(req, req.file) : null;
    if (!imageUrl) return res.status(400).json({ success: false, message: "Team member image is required" });
    const created = await prisma.teamMember.create({
      data: {
        name: String(name || "").trim(),
        role: role ? String(role).trim() : null,
        photoUrl: imageUrl || "",
        description: description ? String(description).trim() : null,
        email: email ? String(email).trim() : null,
        phone: phone ? String(phone).trim() : null,
        department: department ? String(department).trim() : null,
        location: location ? String(location).trim() : null,
        experienceYears: Number.isFinite(Number(experienceYears)) ? Number(experienceYears) : null,
        skills: skills ? String(skills).trim() : null,
        active: active === undefined ? true : active === true || String(active) === "true",
        priority: Number.isFinite(Number(priority)) ? Number(priority) : 0,
      },
    });
    res.status(201).json({ success: true, data: created });
  } catch (e) {
    next(e);
  }
};

const updateTeamMember = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      role,
      description,
      email,
      phone,
      department,
      location,
      experienceYears,
      skills,
      active,
      priority,
    } = req.body;
    const patch = {};
    const existing = await prisma.teamMember.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ success: false, message: "Team member not found" });
    if (name !== undefined) patch.name = String(name || "").trim();
    if (role !== undefined) patch.role = role ? String(role).trim() : null;
    if (req.file) {
      patch.photoUrl = toPublicImageUrl(req, req.file);
      const oldFilePath = filePathFromPublicUrl(existing.photoUrl);
      if (oldFilePath && fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath);
    }
    if (description !== undefined) patch.description = description ? String(description).trim() : null;
    if (email !== undefined) patch.email = email ? String(email).trim() : null;
    if (phone !== undefined) patch.phone = phone ? String(phone).trim() : null;
    if (department !== undefined) patch.department = department ? String(department).trim() : null;
    if (location !== undefined) patch.location = location ? String(location).trim() : null;
    if (experienceYears !== undefined) patch.experienceYears = Number.isFinite(Number(experienceYears)) ? Number(experienceYears) : null;
    if (skills !== undefined) patch.skills = skills ? String(skills).trim() : null;
    if (active !== undefined) patch.active = active === true || String(active) === "true";
    if (priority !== undefined) patch.priority = Number.isFinite(Number(priority)) ? Number(priority) : 0;
    const updated = await prisma.teamMember.update({ where: { id }, data: patch });
    res.status(200).json({ success: true, data: updated });
  } catch (e) {
    next(e);
  }
};

const deleteTeamMember = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await prisma.teamMember.findUnique({ where: { id } });
    await prisma.teamMember.delete({ where: { id } });
    const oldFilePath = filePathFromPublicUrl(existing?.photoUrl);
    if (oldFilePath && fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath);
    res.status(200).json({ success: true, message: "Team member deleted" });
  } catch (e) {
    next(e);
  }
};

module.exports = { listTeamMembersAdmin, createTeamMember, updateTeamMember, deleteTeamMember };
