const siteQueries = require("../db_query/site.query");

async function getSiteConfigService() {
  let row = await siteQueries.getSiteConfigQuery();
  if (!row) {
    row = await siteQueries.upsertSiteConfigQuery({});
  }
  return row;
}

async function updateSiteConfigService(data) {
  const patch = {};
  if (data.siteTitle !== undefined) patch.siteTitle = String(data.siteTitle).slice(0, 120);
  if (data.tagline !== undefined) patch.tagline = data.tagline ? String(data.tagline).slice(0, 240) : null;
  if (data.contactEmail !== undefined) patch.contactEmail = data.contactEmail ? String(data.contactEmail).slice(0, 120) : null;
  if (data.footerNote !== undefined) patch.footerNote = data.footerNote ? String(data.footerNote).slice(0, 8000) : null;
  return siteQueries.upsertSiteConfigQuery(patch);
}

module.exports = { getSiteConfigService, updateSiteConfigService };
