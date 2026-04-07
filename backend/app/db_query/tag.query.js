const prisma = require('./prisma');

const createTagQuery = async (data) => {
    return prisma.tag.create({ data });
};

const updateTagQuery = async (id, data) => {
    return prisma.tag.update({ where: { id }, data });
};

const deleteTagQuery = async (id) => {
    return prisma.tag.delete({ where: { id } });
};

const getAllTagsQuery = async () => {
    // Optionally include the count of _count: { posts: true }
    return prisma.tag.findMany({
        include: {
            _count: {
                select: { posts: true }
            }
        }
    });
};

module.exports = {
    createTagQuery, updateTagQuery, deleteTagQuery, getAllTagsQuery
};
