const userService = require('../../services/user.service');

const createUser = async (req, res, next) => {
    try {
        const result = await userService.createUserService(req.body);
        res.status(201).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await userService.updateUserService(id, req.body);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        await userService.deleteUserService(id);
        res.status(200).json({ success: true, message: 'User deleted safely' });
    } catch (error) {
        next(error);
    }
};

const getAllUsers = async (req, res, next) => {
    try {
        const filters = {};
        if (req.query.roleIn) {
            filters.role = { in: req.query.roleIn.split(',') };
        }
        if (req.query.status) {
            filters.status = req.query.status;
        }

        const users = await userService.getAllUsersService(filters);
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        next(error);
    }
};

const getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await userService.getUserByIdService(id);
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        if(error.message === 'User Not Found') {
            return res.status(404).json({ success: false, message: error.message });
        }
        next(error);
    }
};

module.exports = { createUser, updateUser, deleteUser, getAllUsers, getUserById };
