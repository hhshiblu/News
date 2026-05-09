const userQueries = require('../db_query/user.query');
const bcrypt = require('bcrypt');
const MAX_USER_BIO_LENGTH = 190;
const MAX_USER_POSITION_LENGTH = 120;

function sanitizeProfileShape(userData = {}) {
    if (userData.bio !== undefined && userData.bio !== null) {
        const b = String(userData.bio).trim();
        if (b.length > MAX_USER_BIO_LENGTH) {
            const err = new Error(`Bio is too long. Maximum ${MAX_USER_BIO_LENGTH} characters allowed.`);
            err.statusCode = 400;
            throw err;
        }
        userData.bio = b || null;
    }
    if (userData.position !== undefined && userData.position !== null) {
        const p = String(userData.position).trim();
        if (p.length > MAX_USER_POSITION_LENGTH) {
            const err = new Error(`Position is too long. Maximum ${MAX_USER_POSITION_LENGTH} characters allowed.`);
            err.statusCode = 400;
            throw err;
        }
        userData.position = p || null;
    }
}

const createUserService = async (userData) => {
    sanitizeProfileShape(userData);
    if (userData.password) {
        userData.password = await bcrypt.hash(userData.password, 10);
    }
    if (userData.status == null) {
        userData.status = "ACTIVE";
    }
    if (userData.socials && typeof userData.socials === "string") {
        try {
            userData.socials = JSON.parse(userData.socials);
        } catch (_) {
            userData.socials = undefined;
        }
    }
    const user = await userQueries.createUserQuery(userData);
    const { password: _, ...sanitizedUser } = user;
    return sanitizedUser;
};

const verifyMyPasswordService = async (userId, oldPassword) => {
    const user = await userQueries.getUserWithPasswordQuery(userId);
    if (!user) {
        const err = new Error("User Not Found");
        err.statusCode = 404;
        throw err;
    }
    if (!user.password) {
        const err = new Error("No password is set for this account.");
        err.statusCode = 400;
        throw err;
    }
    const match = await bcrypt.compare(oldPassword, user.password);
    return match;
};

const updateSelfUserService = async (userId, body) => {
    const data = {};
    const allow = ["name", "bio", "avatar", "position", "socials", "password"];
    for (const k of allow) {
        if (body[k] !== undefined) data[k] = body[k];
    }
    if (data.socials && typeof data.socials === "string") {
        try {
            data.socials = JSON.parse(data.socials);
        } catch (_) {
            delete data.socials;
        }
    }
    if (data.password) {
        if (!body.oldPassword) {
            const err = new Error("Old password is required to change password.");
            err.statusCode = 400;
            throw err;
        }
        const user = await userQueries.getUserWithPasswordQuery(userId);
        if (!user.password) {
            const err = new Error("No password is set for this account.");
            err.statusCode = 400;
            throw err;
        }
        const match = await bcrypt.compare(body.oldPassword, user.password);
        if (!match) {
            const err = new Error("Incorrect old password.");
            err.statusCode = 400;
            throw err;
        }
        data.password = await bcrypt.hash(data.password, 10);
    } else {
        delete data.password;
    }
    sanitizeProfileShape(data);
    if (Object.keys(data).length === 0) {
        return userQueries.getUserByIdQuery(userId);
    }
    return userQueries.updateUserQuery(userId, data);
};

const updateUserService = async (id, userData) => {
    sanitizeProfileShape(userData);
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
    updateSelfUserService,
    deleteUserService,
    getAllUsersService,
    getUserByIdService,
    verifyMyPasswordService
};
