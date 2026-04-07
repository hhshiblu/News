const express = require('express');
const { createIssue, getIssues, resolveIssue } = require('../../controller/admin/issue.controller');
const { protect, authorize } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.get('/', protect, getIssues);
router.post('/', protect, authorize('ADMIN'), createIssue); // Only admins create issues
router.patch('/:id/resolve', protect, resolveIssue);

module.exports = router;
