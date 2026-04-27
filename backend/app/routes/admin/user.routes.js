const express = require('express');
const {
  createUser,
  updateUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateMyProfile,
} = require('../../controller/admin/user.controller');
const { protect, authorize } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.use(protect);
router.patch('/me', updateMyProfile);
router.get('/', authorize('ADMIN'), getAllUsers);
router.post('/', authorize('ADMIN'), createUser);
router.get('/:id', authorize('ADMIN'), getUserById);
router.patch('/:id', authorize('ADMIN'), updateUser);
router.delete('/:id', authorize('ADMIN'), deleteUser);

module.exports = router;
