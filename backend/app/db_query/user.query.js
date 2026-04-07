const prisma = require('./prisma');

const createUserQuery = async (data) => {
    return prisma.user.create({ data });
};

const updateUserQuery = async (id, data) => {
    return prisma.user.update({
        where: { id },
        data,
        select: { id: true, name: true, email: true, role: true, bio: true, avatar: true }
    });
};

const deleteUserQuery = async (id) => {
    return prisma.user.delete({ where: { id } });
};

const getAllUsersQuery = async (filters = {}) => {
    return prisma.user.findMany({
        where: filters,
        select: { id: true, name: true, email: true, role: true, bio: true, avatar: true, status: true, createdAt: true }
    });
};

const getUserByIdQuery = async (id) => {
    return prisma.user.findUnique({
        where: { id },
        select: { id: true, name: true, email: true, role: true, bio: true, avatar: true, createdAt: true }
    });
};

module.exports = {
    createUserQuery,
    updateUserQuery,
    deleteUserQuery,
    getAllUsersQuery,
    getUserByIdQuery
};
