const express = require('express');
const { getSubmissions, deleteSubmission, downloadImage } = require('../../controller/admin/submission.controller');
const { protect, authorize } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.use(protect);
router.use(authorize('ADMIN'));

router.get('/', getSubmissions);
router.get('/download', downloadImage);
router.delete('/:id', deleteSubmission);

module.exports = router;
