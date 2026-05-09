const express = require('express');
const { getReporterProfile, applyForReporter } = require('../../controller/public/reporter.controller');

const router = express.Router();

router.post('/apply', applyForReporter);
router.get('/:username', getReporterProfile);

module.exports = router;
