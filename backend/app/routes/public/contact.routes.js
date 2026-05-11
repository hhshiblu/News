const express = require('express');
const { submitContactMessage } = require('../../controller/public/contact.controller');
const router = express.Router();

router.post('/', submitContactMessage);

module.exports = router;
