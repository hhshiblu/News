const express = require('express');
const { createTag, updateTag, deleteTag, getAllTags } = require('../../controller/admin/tag.controller');
const { protect, authorize } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.use(protect, authorize('ADMIN'));

router.get('/', getAllTags);
router.post('/', createTag);
router.patch('/:id', updateTag);
router.delete('/:id', deleteTag);

module.exports = router;
