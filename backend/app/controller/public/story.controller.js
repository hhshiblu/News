const storyService = require('../../services/story.service');

const getStories = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const filters = { status: 'ACTIVE' };
        
        const result = await storyService.getPaginatedStoriesService(filters, page, limit);
        res.status(200).json({ success: true, ...result });
    } catch (error) {
        next(error);
    }
};

const getStoryBySlug = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const result = await storyService.getStoryBySlugService(slug);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getStories,
    getStoryBySlug
};
