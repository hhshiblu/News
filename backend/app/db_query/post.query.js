const prisma = require('./prisma');

const createPostQuery = async (data) => {
    return prisma.post.create({ data });
};

const updatePostQuery = async (id, data) => {
    return prisma.post.update({
        where: { id },
        data
    });
};

const deletePostQuery = async (id) => {
    return prisma.post.delete({
        where: { id }
    });
};

const getPostBySlugQuery = async (slug) => {
    return prisma.post.findUnique({
        where: { slug },
        include: {
            author: { select: { id: true, name: true, avatar: true, bio: true } },
            category: { include: { parent: true } },
            tags: { include: { tag: true } }
        }
    });
};

const getAllPostsQuery = async (whereFilter = {}, skip = 0, take = 10, orderBy = { publishedAt: 'desc' }) => {
    return prisma.post.findMany({
        where: whereFilter,
        skip,
        take,
        orderBy,
        include: {
            author: { select: { name: true, avatar: true, role: true } },
            category: { select: { name: true, slug: true, color: true } },
            tags: { include: { tag: { select: { id: true, name: true, slug: true } } } },
        }
    });
};

const countPostsQuery = async (whereFilter = {}) => {
    return prisma.post.count({ where: whereFilter });
};

const approvePostQuery = async (id) => {
    return prisma.post.update({
        where: { id },
        data: { status: 'PUBLISHED' }
    });
};

const getPostByIdQuery = async (id) => {
    return prisma.post.findUnique({
        where: { id },
        include: {
            author: { select: { id: true, name: true, role: true } },
            category: true
        }
    });
};

module.exports = {
    createPostQuery,
    getPostByIdQuery,
    updatePostQuery,
    deletePostQuery,
    getPostBySlugQuery,
    getAllPostsQuery,
    countPostsQuery,
    approvePostQuery
};
