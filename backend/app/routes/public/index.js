const express = require('express');
const categoryRoutes = require('./category.routes');
const postRoutes = require('./post.routes');
const reporterRoutes = require('./reporter.routes');
const newsletterRoutes = require('./newsletter.routes');
const tagRoutes = require('./tag.routes');
const submissionRoutes = require('./submission.routes');
const partnerRoutes = require("./partner.routes");
const teamMemberRoutes = require("./teamMember.routes");
const storyRoutes = require("./story.routes");
const contactRoutes = require("./contact.routes");
const { getAdBySlot, getAdSlotPresets } = require('../../controller/public/ad.controller');
const router = express.Router();

router.get('/health', (req, res) => res.status(200).json({ success: true, message: 'Public sub-system healthy' }));
router.get('/ads/presets', getAdSlotPresets);
router.get('/ads', getAdBySlot);
router.use('/categories', categoryRoutes);
router.use('/posts', postRoutes);
router.use('/reporters', reporterRoutes);
router.use('/newsletter', newsletterRoutes);
router.use('/tags', tagRoutes);
router.use('/submissions', submissionRoutes);
router.use("/partners", partnerRoutes);
router.use("/team-members", teamMemberRoutes);
router.use("/stories", storyRoutes);
router.use("/contact", contactRoutes);

module.exports = router;

