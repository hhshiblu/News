const express = require('express');
const { submitNews } = require('../../controller/public/submission.controller');
const { upload } = require('../../controller/admin/upload.controller');

const router = express.Router();

router.post('/', upload.array('images', 5), submitNews);

module.exports = router;
