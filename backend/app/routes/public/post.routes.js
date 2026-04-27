const express = require('express');
const { getPublicFeed, getSinglePost, recordPostClick } = require('../../controller/public/post.controller');

const router = express.Router();

router.get('/', getPublicFeed);
router.post('/:slug/click', recordPostClick);
router.get('/:slug', getSinglePost);

module.exports = router;
