const prisma = require('../../db_query/prisma');

const slugifyName = (name) =>
    String(name || '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

const applyForReporter = async (req, res, next) => {
    try {
        res.status(200).json({ success: true, message: 'Application submitted successfully to Admin.' });
    } catch (err) {
        next(err);
    }
};

/**
 * GET /reporters/:slug — slug from reporter name (e.g. reporter-one) or raw user id (uuid)
 * Returns reporter + all published posts (category + tags for grouping on the client)
 */
const getReporterProfile = async (req, res, next) => {
    try {
        const param = decodeURIComponent(req.params.username || req.params.slug || '').trim();
        if (!param) {
            return res.status(400).json({ success: false, message: 'Invalid reporter' });
        }

        const isUuid =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
                param
            );

        let reporter = null;

        if (isUuid) {
            reporter = await prisma.user.findFirst({
                where: { id: param },
                select: {
                    id: true,
                    name: true,
                    bio: true,
                    avatar: true,
                    role: true,
                    position: true,
                    socials: true,
                    email: true,
                    createdAt: true,
                },
            });
        }

        if (!reporter) {
            const candidates = await prisma.user.findMany({
                where: {
                    status: 'ACTIVE',
                    role: { in: ['REPORTER', 'RESEARCH_AUTHOR'] },
                },
                select: {
                    id: true,
                    name: true,
                    bio: true,
                    avatar: true,
                    role: true,
                    position: true,
                    socials: true,
                    email: true,
                    createdAt: true,
                },
            });
            const want = param.toLowerCase();
            reporter =
                candidates.find((u) => slugifyName(u.name) === want) ||
                candidates.find((u) => u.name.toLowerCase() === want.replace(/-/g, ' '));
        }

        if (!reporter) {
            return res.status(404).json({ success: false, message: 'Reporter not found' });
        }

        const page = Math.max(1, parseInt(req.query.page, 10) || 1);
        const limit = Math.min(Math.max(1, parseInt(req.query.limit, 10) || 12), 48);
        const skip = (page - 1) * limit;

        const wherePosts = { authorId: reporter.id, status: 'PUBLISHED' };
        const includePosts = {
            category: { include: { parent: true } },
            tags: { include: { tag: true } },
        };

        const [posts, total] = await Promise.all([
            prisma.post.findMany({
                where: wherePosts,
                orderBy: [{ feedPriority: 'desc' }, { publishedAt: 'desc' }],
                skip,
                take: limit,
                include: includePosts,
            }),
            prisma.post.count({ where: wherePosts }),
        ]);

        const totalPages = Math.max(1, Math.ceil(total / limit));

        res.status(200).json({
            success: true,
            data: {
                reporter: {
                    ...reporter,
                    slug: slugifyName(reporter.name),
                },
                posts,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages,
                },
            },
        });
    } catch (err) {
        next(err);
    }
};

module.exports = { applyForReporter, getReporterProfile };
