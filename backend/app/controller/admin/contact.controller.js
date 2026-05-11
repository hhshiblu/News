const prisma = require("../../db_query/prisma");

const getContactMessages = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const [messages, total] = await Promise.all([
            prisma.contactMessage.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.contactMessage.count()
        ]);

        res.status(200).json({
            success: true,
            data: messages,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (err) {
        next(err);
    }
};

const markAsRead = async (req, res, next) => {
    try {
        const { id } = req.params;
        const msg = await prisma.contactMessage.update({
            where: { id },
            data: { read: true }
        });
        res.status(200).json({ success: true, data: msg });
    } catch (err) {
        next(err);
    }
};

const deleteContactMessage = async (req, res, next) => {
    try {
        const { id } = req.params;
        await prisma.contactMessage.delete({ where: { id } });
        res.status(200).json({ success: true, message: 'Message deleted' });
    } catch (err) {
        next(err);
    }
};

module.exports = { getContactMessages, markAsRead, deleteContactMessage };
