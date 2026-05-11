const storyService = require('../../services/story.service');
const fs = require('fs');
const path = require('path');

const createStory = async (req, res, next) => {
    let uploadedFilePath = null;
    try {
        const storyData = req.body;
        
        // Handle thumbnail upload
        if (req.file) {
            uploadedFilePath = req.file.path;
            storyData.thumbnailImage = `/uploads/stories/${req.file.filename}`;
        }

        // Parse content if it's sent as a string (since it's now multipart)
        if (typeof storyData.content === 'string') {
            try {
                storyData.content = JSON.parse(storyData.content);
            } catch (e) {
                // Keep as string if parsing fails, or handle error
            }
        }

        const result = await storyService.createStoryService(storyData);
        res.status(201).json({ success: true, data: result });
    } catch (error) {
        // Cleanup: delete the uploaded file if story creation fails
        if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
            fs.unlinkSync(uploadedFilePath);
        }
        next(error);
    }
};

const updateStory = async (req, res, next) => {
    let uploadedFilePath = null;
    try {
        const { id } = req.params;
        const storyData = req.body;

        // Handle thumbnail update
        if (req.file) {
            uploadedFilePath = req.file.path;
            storyData.thumbnailImage = `/uploads/stories/${req.file.filename}`;
            
            // Optionally delete old thumbnail if needed
            const existingStory = await storyService.getStoryByIdService(id);
            if (existingStory && existingStory.thumbnailImage) {
                const oldPath = path.join(__dirname, '../../../', existingStory.thumbnailImage);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
        }

        if (typeof storyData.content === 'string') {
            try {
                storyData.content = JSON.parse(storyData.content);
            } catch (e) {
                // Keep as string if parsing fails
            }
        }

        const result = await storyService.updateStoryService(id, storyData);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        // Cleanup new file on error if it was just uploaded
        if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
            fs.unlinkSync(uploadedFilePath);
        }
        next(error);
    }
};

const deleteStory = async (req, res, next) => {
    try {
        const { id } = req.params;
        await storyService.deleteStoryService(id);
        res.status(200).json({ success: true, message: 'Story deleted' });
    } catch (error) {
        next(error);
    }
};

const getAdminStories = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const filters = {};
        if (req.query.status) filters.status = req.query.status;
        
        const result = await storyService.getPaginatedStoriesService(filters, page, limit);
        res.status(200).json({ success: true, ...result });
    } catch (error) {
        next(error);
    }
};

const getStoryById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await storyService.getStoryByIdService(id);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

const toggleStoryStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await storyService.toggleStoryStatusService(id);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createStory,
    updateStory,
    deleteStory,
    getAdminStories,
    getStoryById,
    toggleStoryStatus
};
