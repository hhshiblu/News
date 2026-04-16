const prisma = require("../../db_query/prisma");

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
    const { name, role, photoUrl, profileUrl, active, priority } = req.body;
    const created = await prisma.teamMember.create({
      data: {
        name: String(name || "").trim(),
        role: role ? String(role).trim() : null,
        photoUrl: String(photoUrl || "").trim(),
        profileUrl: profileUrl ? String(profileUrl).trim() : null,
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
    const { name, role, photoUrl, profileUrl, active, priority } = req.body;
    const patch = {};
    if (name !== undefined) patch.name = String(name || "").trim();
    if (role !== undefined) patch.role = role ? String(role).trim() : null;
    if (photoUrl !== undefined) patch.photoUrl = String(photoUrl || "").trim();
    if (profileUrl !== undefined) patch.profileUrl = profileUrl ? String(profileUrl).trim() : null;
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
    await prisma.teamMember.delete({ where: { id } });
    res.status(200).json({ success: true, message: "Team member deleted" });
  } catch (e) {
    next(e);
  }
};

module.exports = { listTeamMembersAdmin, createTeamMember, updateTeamMember, deleteTeamMember };
