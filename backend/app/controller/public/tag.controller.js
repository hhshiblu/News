const tagService = require('../../services/tag.service');

const getAllPublicTags = async (req, res, next) => {
    try {
        const result = await tagService.getAllTagsService();
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

module.exports = { getAllPublicTags };
