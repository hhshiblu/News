const express = require('express');
const router = express.Router();
const storyController = require('../../controller/admin/story.controller');
const storyUpload = require('../../middlewares/storyUpload');
const { protect, authorize } = require('../../middlewares/auth.middleware');

router.use(protect, authorize('ADMIN'));

router.get('/', storyController.getAdminStories);
router.post('/', storyUpload.single('thumbnail'), storyController.createStory);
router.get('/:id', storyController.getStoryById);
router.patch('/:id', storyUpload.single('thumbnail'), storyController.updateStory);
router.delete('/:id', storyController.deleteStory);
router.patch('/:id/toggle-status', storyController.toggleStoryStatus);

module.exports = router;
