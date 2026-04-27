const prisma = require('./prisma');

const createUserQuery = async (data) => {
    return prisma.user.create({ data });
};

const publicUserSelect = {
    id: true,
    name: true,
    email: true,
    role: true,
    bio: true,
    avatar: true,
    position: true,
    socials: true,
    status: true,
    createdAt: true,
};

const updateUserQuery = async (id, data) => {
    return prisma.user.update({
        where: { id },
        data,
        select: publicUserSelect,
    });
};

const deleteUserQuery = async (id) => {
    return prisma.user.delete({ where: { id } });
};

const getAllUsersQuery = async (filters = {}) => {
    return prisma.user.findMany({
        where: filters,
        select: {
            ...publicUserSelect,
            posts: { select: { id: true, status: true } },
        },
    });
};

const getUserByIdQuery = async (id) => {
    return prisma.user.findUnique({
        where: { id },
        select: { ...publicUserSelect },
    });
};

module.exports = {
    createUserQuery,
    updateUserQuery,
    deleteUserQuery,
    getAllUsersQuery,
    getUserByIdQuery,
    publicUserSelect,
};
