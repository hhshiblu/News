const userQueries = require('../db_query/user.query');
const bcrypt = require('bcrypt');

const createUserService = async (userData) => {
    // Admin creating a reporter or author
    if(userData.password) {
        userData.password = await bcrypt.hash(userData.password, 10);
    }
    const user = await userQueries.createUserQuery(userData);
    const { password: _, ...sanitizedUser } = user;
    return sanitizedUser;
};

const updateUserService = async (id, userData) => {
    if(userData.password) {
        userData.password = await bcrypt.hash(userData.password, 10);
    }
    return await userQueries.updateUserQuery(id, userData);
};

const deleteUserService = async (id) => {
    return await userQueries.deleteUserQuery(id);
};

const getAllUsersService = async (filters = {}) => {
    return await userQueries.getAllUsersQuery(filters);
};

const getUserByIdService = async (id) => {
    const user = await userQueries.getUserByIdQuery(id);
    if (!user) throw new Error("User Not Found");
    return user;
};

module.exports = {
    createUserService,
    updateUserService,
    deleteUserService,
    getAllUsersService,
    getUserByIdService
};
