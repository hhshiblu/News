const categoryService = require('../../services/category.service');

const createCategory = async (req, res, next) => {
    try {
        const { name, slug, imageUrl, parentId } = req.body;
        const result = await categoryService.createCategoryService({ name, slug, imageUrl, parentId });
        res.status(201).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

const updateCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const result = await categoryService.updateCategoryService(id, data);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

const deleteCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        await categoryService.deleteCategoryService(id);
        res.status(200).json({ success: true, message: 'Category deleted safely' });
    } catch (error) {
        next(error);
    }
};

const getCategoryTree = async (req, res, next) => {
    try {
        const tree = await categoryService.getCategoryTreeService();
        res.status(200).json({ success: true, data: tree });
    } catch (error) {
        next(error);
    }
};

module.exports = { createCategory, updateCategory, deleteCategory, getCategoryTree };
