const tagService = require('../../services/tag.service');

const createTag = async (req, res, next) => {
    try {
        const { name, slug } = req.body;
        const result = await tagService.createTagService({ name, slug });
        res.status(201).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

const updateTag = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, slug } = req.body;
        const result = await tagService.updateTagService(id, { name, slug });
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

const deleteTag = async (req, res, next) => {
    try {
        const { id } = req.params;
        await tagService.deleteTagService(id);
        res.status(200).json({ success: true, message: 'Tag removed safely' });
    } catch (error) {
        next(error);
    }
};

const getAllTags = async (req, res, next) => {
    try {
        const tags = await tagService.getAllTagsService();
        res.status(200).json({ success: true, data: tags });
    } catch (error) {
        next(error);
    }
};

module.exports = { createTag, updateTag, deleteTag, getAllTags };
