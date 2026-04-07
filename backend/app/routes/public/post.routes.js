const express = require('express');
const { getPublicFeed, getSinglePost } = require('../../controller/public/post.controller');

const router = express.Router();

router.get('/', getPublicFeed);
router.get('/:slug', getSinglePost);

module.exports = router;
