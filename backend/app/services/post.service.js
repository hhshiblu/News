const postQueries = require('../db_query/post.query');
const prisma = require('../db_query/prisma');

const BREAKING_SLUGS = ['breaking-news', 'breaking'];
const MAX_SUBTITLE_LENGTH = 180;

function validateSubtitleLength(postData = {}) {
    if (typeof postData.subtitle !== 'string') return;
    const subtitle = postData.subtitle.trim();
    if (subtitle.length > MAX_SUBTITLE_LENGTH) {
        const err = new Error(`Subtitle is too long. Maximum ${MAX_SUBTITLE_LENGTH} characters allowed.`);
        err.statusCode = 400;
        throw err;
    }
    postData.subtitle = subtitle;
}

async function getBreakingTagIdSet() {
    const tags = await prisma.tag.findMany({
        where: { slug: { in: BREAKING_SLUGS } },
        select: { id: true },
    });
    return new Set(tags.map((t) => t.id));
}

const createPostService = async (postData) => {
    validateSubtitleLength(postData);
    // Generate URL Slug natively mapping structural schemas accurately handling UUID fallbacks globally.
    let baseSlug = postData.title ? postData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : "untitled-post";
    postData.slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    delete postData.featured;
    delete postData.isOpinion;
    delete postData.homeSpotlightPriority;
    const breakingIds = await getBreakingTagIdSet();
    if (postData.tags && Array.isArray(postData.tags)) {
        postData.tags = postData.tags.filter((id) => !breakingIds.has(id));
    }

    // Explicit Prisma PostTag Relation Mapping
    if (postData.tags && Array.isArray(postData.tags)) {
        postData.tags = {
             create: postData.tags.map(tagId => ({ tagId }))
        };
    } else {
        postData.tags = undefined; // Drop mapping if undefined completely bypassing validation faults locally.
    }

    return await postQueries.createPostQuery(postData);
};

const updatePostService = async (id, postData, userId, userRole) => {
    validateSubtitleLength(postData);
    // 1. Ownership Validation for REPORTERS
    if (userRole === 'REPORTER') {
        const existingPost = await postQueries.getPostByIdQuery(id);
        if (!existingPost) throw new Error("Post not found");
        if (existingPost.authorId !== userId) {
            throw new Error("Unauthorized: You can only update your own articles.");
        }
    }

    const breakingIds = await getBreakingTagIdSet();
    if (userRole !== 'ADMIN') {
        delete postData.featured;
        delete postData.isOpinion;
        delete postData.homeSpotlightPriority;
        delete postData.feedPriority;
        if (postData.tags && Array.isArray(postData.tags)) {
            postData.tags = postData.tags.filter((tid) => !breakingIds.has(tid));
        }
    }

    if (postData.homeSpotlightPriority !== undefined && postData.homeSpotlightPriority !== null) {
        const n = parseInt(postData.homeSpotlightPriority, 10);
        postData.homeSpotlightPriority = Number.isFinite(n) ? Math.min(999, Math.max(0, n)) : 0;
    }
    if (postData.feedPriority !== undefined && postData.feedPriority !== null) {
        const n = parseInt(postData.feedPriority, 10);
        postData.feedPriority = Number.isFinite(n) ? Math.min(999, Math.max(0, n)) : 0;
    }

    if(postData.title) {
        postData.slug = `${postData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}-${Date.now().toString().slice(-4)}`;
    }
    
    if (postData.tags && Array.isArray(postData.tags)) {
        postData.tags = {
            deleteMany: {},
            create: postData.tags.map(tagId => ({ tagId }))
        };
    }

    const definedKeys = Object.keys(postData).filter((k) => postData[k] !== undefined);
    const isModerationStatusOnly =
        definedKeys.length === 1 && definedKeys[0] === 'status';
    if (!isModerationStatusOnly) {
        postData.status = 'PENDING';
    }

    return await postQueries.updatePostQuery(id, postData);
};

const deletePostService = async (id, userId, userRole) => {
    // 1. Ownership Validation for REPORTERS
    if (userRole === 'REPORTER') {
        const existingPost = await postQueries.getPostByIdQuery(id);
        if (!existingPost) throw new Error("Post not found");
        if (existingPost.authorId !== userId) {
            throw new Error("Unauthorized: You can only delete your own articles.");
        }
    }
    return await postQueries.deletePostQuery(id);
};

const approvePostService = async (id) => {
    return await postQueries.approvePostQuery(id);
};

const getPaginatedPostsService = async (queryFilters, page = 1, limit = 10, offset = 0) => {
    const sanitizedOffset = Math.max(0, parseInt(offset, 10) || 0);
    const skip = sanitizedOffset + (page - 1) * limit;
    const scopedListing =
        !!queryFilters.authorId ||
        !!queryFilters.categoryId ||
        !!queryFilters.categorySlug ||
        !!queryFilters.parentCategorySlug ||
        !!queryFilters.category;
    let orderBy = { publishedAt: 'desc' };
    if (queryFilters.featured === true) {
        orderBy = [{ homeSpotlightPriority: 'desc' }, { publishedAt: 'desc' }];
    } else if (scopedListing) {
        orderBy = [{ feedPriority: 'desc' }, { publishedAt: 'desc' }];
    }
    const posts = await postQueries.getAllPostsQuery(queryFilters, skip, limit, orderBy);
    const total = await postQueries.countPostsQuery(queryFilters);
    const remaining = Math.max(0, total - sanitizedOffset);
    const totalPages = remaining <= 0 ? 1 : Math.max(1, Math.ceil(remaining / limit));

    return {
        posts,
        total,
        page,
        totalPages,
        offset: sanitizedOffset,
    };
};

const getPostBySlugService = async (slug) => {
    const post = await postQueries.getPostBySlugQuery(slug);
    if (!post || post.status !== 'PUBLISHED') throw new Error("Post Not Found");
    return post;
};

const updatePostTagsService = async (postId, tagIds = []) => {
    if (!Array.isArray(tagIds)) throw new Error("tagIds must be an array");

    const unique = Array.from(new Set(tagIds.filter(Boolean).map(String)));
    const breakingIds = await getBreakingTagIdSet();
    const filtered = unique.filter((id) => !breakingIds.has(id));

    const existingTags = await prisma.tag.findMany({
        where: { id: { in: filtered } },
        select: { id: true },
    });
    const existingIdSet = new Set(existingTags.map((t) => t.id));
    const validTagIds = filtered.filter((id) => existingIdSet.has(id));

    await prisma.$transaction([
        prisma.postTag.deleteMany({ where: { postId } }),
        ...(validTagIds.length
            ? [prisma.postTag.createMany({ data: validTagIds.map((tagId) => ({ postId, tagId })) })]
            : []),
    ]);

    // Return updated post with tags
    return prisma.post.findUnique({
        where: { id: postId },
        include: {
            author: { select: { name: true, avatar: true, role: true } },
            category: { select: { name: true, slug: true, color: true } },
            tags: { include: { tag: { select: { id: true, name: true, slug: true } } } },
        },
    });
};

module.exports = {
    createPostService,
    updatePostService,
    deletePostService,
    approvePostService,
    getPaginatedPostsService,
    getPostBySlugService,
    updatePostTagsService
};
