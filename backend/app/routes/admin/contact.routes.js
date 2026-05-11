const express = require('express');
const { getContactMessages, markAsRead, deleteContactMessage } = require('../../controller/admin/contact.controller');
const router = express.Router();

router.get('/', getContactMessages);
router.patch('/:id/read', markAsRead);
router.delete('/:id', deleteContactMessage);

module.exports = router;
