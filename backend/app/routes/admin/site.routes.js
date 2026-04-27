const express = require("express");
const { getSiteConfig, updateSiteConfig } = require("../../controller/admin/site.controller");
const { protect, authorize } = require("../../middlewares/auth.middleware");

const router = express.Router();

router.use(protect);
router.get("/", getSiteConfig);
router.patch("/", authorize("ADMIN"), updateSiteConfig);

module.exports = router;
