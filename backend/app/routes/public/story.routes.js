const express = require('express');
const router = express.Router();
const storyController = require('../../controller/public/story.controller');

router.get('/', storyController.getStories);
router.get('/:slug', storyController.getStoryBySlug);

module.exports = router;
