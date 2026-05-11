const storyQueries = require('../db_query/story.query');

const createStoryService = async (storyData) => {
    // Generate slug from title
    let baseSlug = storyData.title ? storyData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : "untitled-story";
    storyData.slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
    
    return await storyQueries.createStoryQuery(storyData);
};

const updateStoryService = async (id, storyData) => {
    if (storyData.title) {
        let baseSlug = storyData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        storyData.slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
    }
    
    return await storyQueries.updateStoryQuery(id, storyData);
};

const deleteStoryService = async (id) => {
    return await storyQueries.deleteStoryQuery(id);
};

const getPaginatedStoriesService = async (filters, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const stories = await storyQueries.getAllStoriesQuery(filters, skip, limit);
    const total = await storyQueries.countStoriesQuery(filters);
    
    return {
        stories,
        total,
        page,
        totalPages: Math.ceil(total / limit)
    };
};

const getStoryBySlugService = async (slug) => {
    const story = await storyQueries.getStoryBySlugQuery(slug);
    if (!story || story.status !== 'ACTIVE') {
        throw new Error("Story not found");
    }
    return story;
};

const getStoryByIdService = async (id) => {
    return await storyQueries.getStoryByIdQuery(id);
};

const toggleStoryStatusService = async (id) => {
    const story = await storyQueries.getStoryByIdQuery(id);
    if (!story) throw new Error("Story not found");
    
    const newStatus = story.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
    return await storyQueries.updateStoryQuery(id, { status: newStatus });
};

module.exports = {
    createStoryService,
    updateStoryService,
    deleteStoryService,
    getPaginatedStoriesService,
    getStoryBySlugService,
    getStoryByIdService,
    toggleStoryStatusService
};
