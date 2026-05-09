const postService = require('../../services/post.service');
// Redis/BullMQ click queue temporarily disabled.
// const { addPostClickJob } = require('../../services/queue.service');

const getPublicFeed = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = Math.max(0, parseInt(req.query.offset, 10) || 0);
        
        // Only return published posts for public feed
        const filter = { status: 'PUBLISHED' };
        
        // Dynamic filters based on query params
        if (req.query.categoryId) filter.categoryId = req.query.categoryId;
        if (req.query.authorId) filter.authorId = req.query.authorId;
        if (req.query.categorySlug) {
            filter.category = { slug: req.query.categorySlug };
        }
        if (req.query.parentCategorySlug) {
            filter.category = {
                OR: [
                    { slug: req.query.parentCategorySlug },
                    { parent: { slug: req.query.parentCategorySlug } }
                ]
            };
        }
        if (req.query.featured === 'true') filter.featured = true;
        if (req.query.isOpinion === 'true') filter.isOpinion = true;
        if (req.query.isVideo === 'true') filter.isVideo = true;
        if (req.query.isPhotoStory === 'true') filter.isPhotoStory = true;
        if (req.query.tagSlugs) {
            const slugs = String(req.query.tagSlugs)
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean);
            if (slugs.length) {
                filter.tags = {
                    some: {
                        tag: { slug: { in: slugs } },
                    },
                };
            }
        } else if (req.query.tagSlug) {
            filter.tags = {
                some: {
                    tag: {
                        slug: req.query.tagSlug,
                    },
                },
            };
        }

        const result = await postService.getPaginatedPostsService(filter, page, limit, offset);
        res.status(200).json({ success: true, ...result });
    } catch (error) {
        next(error);
    }
};

const getSinglePost = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const post = await postService.getPostBySlugService(slug);
        
        res.status(200).json({ success: true, data: post });
    } catch (error) {
        if(error.message === "Post Not Found") {
            return res.status(404).json({ success: false, message: error.message });
        }
        next(error);
    }
};

const recordPostClick = async (req, res) => {
    const { slug } = req.params;
    if (!slug) return res.status(400).json({ success: false, message: 'Missing slug' });
    try {
        await require('../../db_query/prisma').post.updateMany({
            where: { slug, status: 'PUBLISHED' },
            data: { viewCount: { increment: 1 } }
        });
        return res.status(200).json({ success: true });
    } catch (_) {
        return res.status(200).json({ success: true }); // fail silently — never block the reader
    }
};

module.exports = { getPublicFeed, getSinglePost, recordPostClick };
