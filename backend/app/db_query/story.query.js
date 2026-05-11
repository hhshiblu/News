const prisma = require('./prisma');

const createStoryQuery = async (storyData) => {
    return await prisma.story.create({
        data: storyData
    });
};

const updateStoryQuery = async (id, storyData) => {
    return await prisma.story.update({
        where: { id },
        data: storyData
    });
};

const deleteStoryQuery = async (id) => {
    return await prisma.story.delete({
        where: { id }
    });
};

const getStoryByIdQuery = async (id) => {
    return await prisma.story.findUnique({
        where: { id }
    });
};

const getStoryBySlugQuery = async (slug) => {
    return await prisma.story.findUnique({
        where: { slug }
    });
};

const getAllStoriesQuery = async (filters = {}, skip = 0, take = 10, orderBy = { createdAt: 'desc' }) => {
    return await prisma.story.findMany({
        where: filters,
        skip,
        take,
        orderBy
    });
};

const countStoriesQuery = async (filters = {}) => {
    return await prisma.story.count({
        where: filters
    });
};

module.exports = {
    createStoryQuery,
    updateStoryQuery,
    deleteStoryQuery,
    getStoryByIdQuery,
    getStoryBySlugQuery,
    getAllStoriesQuery,
    countStoriesQuery
};
