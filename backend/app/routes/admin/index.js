const express = require('express');
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const categoryRoutes = require('./category.routes');
const postRoutes = require('./post.routes');
const uploadRoutes = require('./upload.routes');
const tagRoutes = require('./tag.routes');
const issueRoutes = require('./issue.routes');
const adRoutes = require('./ad.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/posts', postRoutes);
router.use('/upload', uploadRoutes);
router.use('/tags', tagRoutes);
router.use('/issues', issueRoutes);
router.use('/ads', adRoutes);

module.exports = router;
