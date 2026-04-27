const prisma = require("../../db_query/prisma");

const listDepartments = async (req, res, next) => {
  try {
    const data = await prisma.department.findMany({
      orderBy: { name: "asc" },
    });
    res.status(200).json({ success: true, data });
  } catch (e) {
    next(e);
  }
};

const createDepartment = async (req, res, next) => {
  try {
    let name = req.body?.name;
    if (typeof name === "string") name = name.trim();
    if (!name) {
      return res.status(400).json({ success: false, message: "Name is required" });
    }
    const created = await prisma.department.create({
      data: { name },
    });
    res.status(201).json({ success: true, data: created });
  } catch (e) {
    next(e);
  }
};

const updateDepartment = async (req, res, next) => {
  try {
    const { id } = req.params;
    let name = req.body?.name;
    if (typeof name === "string") name = name.trim();
    if (!name) {
      return res.status(400).json({ success: false, message: "Name is required" });
    }
    const existing = await prisma.department.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ success: false, message: "Department not found" });
    const updated = await prisma.department.update({
      where: { id },
      data: { name },
    });
    res.status(200).json({ success: true, data: updated });
  } catch (e) {
    next(e);
  }
};

const deleteDepartment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await prisma.department.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ success: false, message: "Department not found" });
    await prisma.department.delete({ where: { id } });
    res.status(200).json({ success: true, message: "Department deleted" });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  listDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};
