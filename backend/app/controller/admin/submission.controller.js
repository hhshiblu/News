const { PrismaClient } = require('@prisma/client');
const path = require('path');
const fs = require('fs');
const prisma = new PrismaClient();

const getSubmissions = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;

        const submissions = await prisma.publicSubmission.findMany({
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' }
        });
        
        const total = await prisma.publicSubmission.count();

        res.status(200).json({
            success: true,
            submissions,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (err) {
        next(err);
    }
};

const getNewsletterSubscribers = async (req, res, next) => {
    try {
        const subscribers = await prisma.newsletterSubscriber.findMany({
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json({
            success: true,
            subscribers
        });
    } catch (err) {
        next(err);
    }
};

const deleteSubmission = async (req, res, next) => {
    try {
        const { id } = req.params;
        await prisma.publicSubmission.delete({
            where: { id }
        });
        res.status(200).json({ success: true, message: 'Submission deleted' });
    } catch (err) {
        next(err);
    }
};

const downloadImage = async (req, res, next) => {
    try {
        const { file } = req.query;
        if (!file) return res.status(400).json({ success: false, message: 'No file specified' });
        
        // ensure nobody breaks out of internal directory
        const safePath = path.normalize(file).replace(/^(\.\.(\/|\\|$))+/, '');
        const absolutePath = path.join(__dirname, '../../..', safePath);
        
        if (!fs.existsSync(absolutePath)) {
             return res.status(404).json({ success: false, message: 'File not found' });
        }
        res.download(absolutePath);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getSubmissions,
    getNewsletterSubscribers,
    deleteSubmission,
    downloadImage
};
