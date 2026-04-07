const express = require('express');
const { login, logout, setupAdmin, getMe, register } = require('../../controller/admin/auth.controller');
const { protect } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);
router.post('/setup', setupAdmin); // A temporary route to seed first admin
router.get('/me', protect, getMe);

module.exports = router;
