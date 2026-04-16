const express = require('express');
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const categoryRoutes = require('./category.routes');
const postRoutes = require('./post.routes');
const uploadRoutes = require('./upload.routes');
const tagRoutes = require('./tag.routes');
const issueRoutes = require('./issue.routes');
const adRoutes = require('./ad.routes');
const submissionRoutes = require('./submission.routes');
const newsletterRoutes = require('./newsletter.routes');
const partnerRoutes = require("./partner.routes");
const teamMemberRoutes = require("./teamMember.routes");

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/posts', postRoutes);
router.use('/upload', uploadRoutes);
router.use('/tags', tagRoutes);
router.use('/issues', issueRoutes);
router.use('/ads', adRoutes);
router.use('/submissions', submissionRoutes);
router.use('/newsletter', newsletterRoutes);
router.use("/partners", partnerRoutes);
router.use("/team-members", teamMemberRoutes);

module.exports = router;
