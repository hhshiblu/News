const express = require('express');
const { getNewsletterSubscribers } = require('../../controller/admin/submission.controller');
const { protect, authorize } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.use(protect);
router.use(authorize('ADMIN'));

router.get('/', getNewsletterSubscribers);

module.exports = router;
