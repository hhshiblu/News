const express = require('express');
const { upload, uploadFile } = require('../../controller/admin/upload.controller');
const { protect, authorize } = require('../../middlewares/auth.middleware');

const router = express.Router();

// router.use(protect);
// router.use(authorize('ADMIN', 'REPORTER', 'RESEARCH_AUTHOR'));

router.post('/', upload.single('media'), uploadFile);

module.exports = router;
