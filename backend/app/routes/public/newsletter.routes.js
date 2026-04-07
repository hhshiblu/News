const express = require('express');
const { subscribeNewsletter } = require('../../controller/public/newsletter.controller');

const router = express.Router();

router.post('/subscribe', subscribeNewsletter);

module.exports = router;
