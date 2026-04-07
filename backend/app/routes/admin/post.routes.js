const express = require('express');
const { createPost, updatePost, deletePost, approvePost, getAdminPosts } = require('../../controller/admin/post.controller');
const { protect, authorize } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.use(protect); // Ensure all routes below are logged in

router.get('/', getAdminPosts);
router.post('/', createPost);
router.patch('/:id', updatePost);
router.delete('/:id', deletePost);

// Admin Only Route
router.patch('/:id/approve', authorize('ADMIN'), approvePost);

module.exports = router;
