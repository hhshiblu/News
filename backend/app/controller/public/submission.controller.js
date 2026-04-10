const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const submitNews = async (req, res, next) => {
    try {
        const { senderName, senderEmail, title, content } = req.body;
        
        let images = [];
        if (req.files && req.files.length > 0) {
            images = req.files.map(file => `/uploads/news/images/${file.filename}`);
        }

        const newSubmission = await prisma.publicSubmission.create({
            data: {
                senderName,
                senderEmail,
                title,
                content,
                images,
                status: 'PENDING'
            }
        });

        res.status(201).json({
            success: true,
            submission: newSubmission
        });
    } catch(err) {
        next(err);
    }
};

module.exports = {
    submitNews
};
