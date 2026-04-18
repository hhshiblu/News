const categoryService = require('../../services/category.service');

const slugFromName = (name) =>
  String(name || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

const createCategory = async (req, res, next) => {
    try {
        let name = req.body?.name;
        if (typeof name === 'string') name = name.trim();
        if (!name) {
            return res.status(400).json({ success: false, message: 'Name is required' });
        }

        let { slug, imageUrl, parentId } = req.body;

        if (req.file) {
            imageUrl = `${req.protocol}://${req.get('host')}/uploads/category/${req.file.filename}`;
        }

        if (!slug || !String(slug).trim()) {
            slug = slugFromName(name);
        } else {
            slug = String(slug).trim();
        }

        if (parentId === '' || parentId === undefined || parentId === null) {
            parentId = null;
        } else {
            parentId = String(parentId).trim();
        }

        const result = await categoryService.createCategoryService({
            name,
            slug,
            imageUrl: imageUrl || null,
            parentId,
        });
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
