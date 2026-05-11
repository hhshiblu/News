const express = require('express');
const { createCategory, updateCategory, deleteCategory, getCategoryTree } = require('../../controller/admin/category.controller');
const { uploadCategoryImage } = require('../../middlewares/entityImageUpload.middleware');
const { protect, authorize } = require('../../middlewares/auth.middleware');

const router = express.Router();

// Only ADMIN can manage categories
router.use(protect, authorize('ADMIN'));

router.get('/', getCategoryTree);
router.post('/', uploadCategoryImage.single('image'), createCategory);
router.patch('/:id', updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;
