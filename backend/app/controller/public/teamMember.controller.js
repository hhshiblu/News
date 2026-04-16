const prisma = require("../../db_query/prisma");

const getPublicTeamMembers = async (req, res, next) => {
  try {
    const data = await prisma.teamMember.findMany({
      where: { active: true },
      orderBy: [{ priority: "desc" }, { updatedAt: "desc" }],
    });
    res.status(200).json({ success: true, data });
  } catch (e) {
    next(e);
  }
};

module.exports = { getPublicTeamMembers };
