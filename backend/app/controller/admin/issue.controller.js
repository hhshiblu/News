const prisma = require('../../db_query/prisma');

const createIssue = async (req, res, next) => {
    try {
        const { postId, description, severity } = req.body;
        const adminId = req.user.id;

        const [issue] = await prisma.$transaction([
            prisma.issue.create({
                data: {
                    postId,
                    adminId,
                    description,
                    severity: severity || 'MEDIUM',
                    resolved: false
                }
            }),
            prisma.post.update({
                where: { id: postId },
                data: { status: 'PENDING' }
            })
        ]);

        res.status(201).json({ success: true, data: issue });
    } catch (error) {
        next(error);
    }
};

const getIssues = async (req, res, next) => {
    try {
        const where = {};
        if (req.user.role === 'AUTHOR') {
            where.post = { authorId: req.user.id };
        }

        const issues = await prisma.issue.findMany({
            where,
            include: {
                post: { select: { title: true, slug: true } },
                admin: { select: { name: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json({ success: true, data: issues });
    } catch (error) {
        next(error);
    }
};

const resolveIssue = async (req, res, next) => {
    try {
        const { id } = req.params;
        const issue = await prisma.issue.update({
            where: { id },
            data: { resolved: true }
        });
        res.status(200).json({ success: true, data: issue });
    } catch (error) {
        next(error);
    }
};

module.exports = { createIssue, getIssues, resolveIssue };
