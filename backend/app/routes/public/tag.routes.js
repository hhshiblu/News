const express = require('express');
const tagController = require('../../controller/public/tag.controller');
const router = express.Router();

router.get('/', tagController.getAllPublicTags);

module.exports = router;
