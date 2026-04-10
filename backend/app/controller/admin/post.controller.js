const postService = require('../../services/post.service');

const createPost = async (req, res, next) => {
    try {
        // Enforce role-based article creation: Only AUTHORS can create new stories
        if (req.user.role !== 'AUTHOR') {
            return res.status(403).json({ 
                success: false, 
                message: 'Access Denied: Only authors can pitch new articles. Admins oversee moderation.' 
            });
        }

        const postData = req.body;
        // Securely mapping the logged-in user as the author
        postData.authorId = req.user.id;
        postData.status = 'PENDING';

        const result = await postService.createPostService(postData);
        res.status(201).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

const updatePost = async (req, res, next) => {
    try {
        const { id } = req.params;
        const postData = req.body;
        const result = await postService.updatePostService(id, postData, req.user.id, req.user.role);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

const deletePost = async (req, res, next) => {
    try {
        const { id } = req.params;
        await postService.deletePostService(id, req.user.id, req.user.role);
        res.status(200).json({ success: true, message: 'Post deleted safely' });
    } catch (error) {
        next(error);
    }
};

const approvePost = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await postService.approvePostService(id); // Only Admin via middleware
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

const getAdminPosts = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        
        const filter = {};
        if (req.query.status) {
             filter.status = req.query.status;
        }

        // Role-based filtering: Authors only see their own posts
        if (req.user.role === 'AUTHOR') {
            filter.authorId = req.user.id;
        }
        
        const result = await postService.getPaginatedPostsService(filter, page, limit);
        res.status(200).json({ success: true, ...result });
    } catch (error) {
        next(error);
    }
};

const updatePostTags = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { tagIds } = req.body;
        const result = await postService.updatePostTagsService(id, tagIds);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

module.exports = { createPost, updatePost, deletePost, approvePost, getAdminPosts, updatePostTags };
