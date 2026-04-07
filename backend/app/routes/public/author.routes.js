const express = require('express');
const { getAuthorProfile, applyForAuthor } = require('../../controller/public/author.controller');

const router = express.Router();

router.post('/apply', applyForAuthor);
router.get('/:username', getAuthorProfile);

module.exports = router;
