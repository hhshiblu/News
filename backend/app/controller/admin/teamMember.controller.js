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
const MAX_TEAM_DESCRIPTION = 190;

const toTrimmedOrNull = (value) => {
  if (value === undefined) return undefined;
  if (value === null) return null;
  const t = String(value).trim();
  return t ? t : null;
};

const validateTeamDescription = (value) => {
  if (value == null) return;
  if (value.length > MAX_TEAM_DESCRIPTION) {
    const err = new Error(
      `Description is too long. Maximum ${MAX_TEAM_DESCRIPTION} characters allowed.`
    );
    err.statusCode = 400;
    throw err;
  }
};

async function resolveDepartmentIdForCreate(raw) {
  if (raw === undefined || raw === null) return null;
  const s = String(raw).trim();
  if (!s) return null;
  const d = await prisma.department.findUnique({ where: { id: s } });
  if (!d) {
    const err = new Error("Invalid department");
    err.statusCode = 400;
    throw err;
  }
  return s;
}

async function resolveDepartmentIdForUpdate(raw) {
  if (raw === undefined) return undefined;
  if (raw === null) return null;
  const s = String(raw).trim();
  if (!s) return null;
  const d = await prisma.department.findUnique({ where: { id: s } });
  if (!d) {
    const err = new Error("Invalid department");
    err.statusCode = 400;
    throw err;
  }
  return s;
}

const listTeamMembersAdmin = async (req, res, next) => {
  try {
    const data = await prisma.teamMember.findMany({
      orderBy: [{ priority: "desc" }, { updatedAt: "desc" }],
      include: {
        department: { select: { id: true, name: true } },
      },
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
      departmentId,
      location,
      experienceYears,
      skills,
      active,
      priority,
    } = req.body;
    const imageUrl = req.file ? toPublicImageUrl(req, req.file) : null;
    if (!imageUrl) return res.status(400).json({ success: false, message: "Team member image is required" });
    const safeDescription = toTrimmedOrNull(description);
    validateTeamDescription(safeDescription);
    const deptId = await resolveDepartmentIdForCreate(departmentId);
    const created = await prisma.teamMember.create({
      data: {
        name: String(name || "").trim(),
        role: toTrimmedOrNull(role),
        photoUrl: imageUrl || "",
        description: safeDescription,
        email: toTrimmedOrNull(email),
        phone: toTrimmedOrNull(phone),
        departmentId: deptId,
        location: toTrimmedOrNull(location),
        experienceYears: Number.isFinite(Number(experienceYears)) ? Number(experienceYears) : null,
        skills: toTrimmedOrNull(skills),
        active: active === undefined ? true : active === true || String(active) === "true",
        priority: Number.isFinite(Number(priority)) ? Number(priority) : 0,
      },
      include: {
        department: { select: { id: true, name: true } },
      },
    });
    res.status(201).json({ success: true, data: created });
  } catch (e) {
    if (e?.code === "P2000") {
      return res.status(400).json({
        success: false,
        message: "One or more team-member fields are too long. Please shorten and try again.",
      });
    }
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
      departmentId,
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
    if (role !== undefined) patch.role = toTrimmedOrNull(role);
    if (req.file) {
      patch.photoUrl = toPublicImageUrl(req, req.file);
      const oldFilePath = filePathFromPublicUrl(existing.photoUrl);
      if (oldFilePath && fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath);
    }
    if (description !== undefined) {
      patch.description = toTrimmedOrNull(description);
      validateTeamDescription(patch.description);
    }
    if (email !== undefined) patch.email = toTrimmedOrNull(email);
    if (phone !== undefined) patch.phone = toTrimmedOrNull(phone);
    if (departmentId !== undefined) {
      const resolved = await resolveDepartmentIdForUpdate(departmentId);
      patch.departmentId = resolved;
    }
    if (location !== undefined) patch.location = toTrimmedOrNull(location);
    if (experienceYears !== undefined) patch.experienceYears = Number.isFinite(Number(experienceYears)) ? Number(experienceYears) : null;
    if (skills !== undefined) patch.skills = skills ? String(skills).trim() : null;
    if (active !== undefined) patch.active = active === true || String(active) === "true";
    if (priority !== undefined) patch.priority = Number.isFinite(Number(priority)) ? Number(priority) : 0;
    const updated = await prisma.teamMember.update({
      where: { id },
      data: patch,
      include: {
        department: { select: { id: true, name: true } },
      },
    });
    res.status(200).json({ success: true, data: updated });
  } catch (e) {
    if (e?.code === "P2000") {
      return res.status(400).json({
        success: false,
        message: "One or more team-member fields are too long. Please shorten and try again.",
      });
    }
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
