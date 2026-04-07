const express = require('express');
const { createUser, updateUser, deleteUser, getAllUsers, getUserById } = require('../../controller/admin/user.controller');
const { protect, authorize } = require('../../middlewares/auth.middleware');

const router = express.Router();

// router.use(protect);
// router.use(authorize('ADMIN')); // All user management restricted to ADMIN

router.route('/')
    .get(getAllUsers)
    .post(createUser);

router.route('/:id')
    .get(getUserById)
    .patch(updateUser)
    .delete(deleteUser);

module.exports = router;
