const prisma = require("./prisma");

async function getSiteConfigQuery() {
  return prisma.siteConfig.findUnique({ where: { id: "singleton" } });
}

async function upsertSiteConfigQuery(data) {
  const patch = { ...data };
  return prisma.siteConfig.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", ...patch },
    update: patch,
  });
}

module.exports = { getSiteConfigQuery, upsertSiteConfigQuery };
