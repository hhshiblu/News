const siteService = require("../../services/site.service");

const getSiteConfig = async (req, res, next) => {
  try {
    const data = await siteService.getSiteConfigService();
    res.status(200).json({ success: true, data });
  } catch (e) {
    next(e);
  }
};

const updateSiteConfig = async (req, res, next) => {
  try {
    const data = await siteService.updateSiteConfigService(req.body || {});
    res.status(200).json({ success: true, data });
  } catch (e) {
    next(e);
  }
};

module.exports = { getSiteConfig, updateSiteConfig };
