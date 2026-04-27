const prisma = require("../../db_query/prisma");
const MAX_SUBMISSION_CONTENT = 180;
const MAX_SUBMISSION_TITLE = 120;

const submitNews = async (req, res, next) => {
    try {
        const { senderName, senderEmail, title, content } = req.body;
        const safeContent = String(content || "").trim();
        if (!safeContent) {
            return res.status(400).json({ success: false, message: "News details are required." });
        }
        if (safeContent.length > MAX_SUBMISSION_CONTENT) {
            return res.status(400).json({
                success: false,
                message: `News details are too long. Maximum ${MAX_SUBMISSION_CONTENT} characters allowed.`,
            });
        }
        const safeTitle = title ? String(title).trim().slice(0, MAX_SUBMISSION_TITLE) : null;
        const safeSenderName = senderName ? String(senderName).trim().slice(0, 120) : null;
        const safeSenderEmail = senderEmail ? String(senderEmail).trim().slice(0, 120) : null;
        
        let images = [];
        if (req.files && req.files.length > 0) {
            images = req.files.map(file => `/uploads/news/images/${file.filename}`);
        }

        const newSubmission = await prisma.publicSubmission.create({
            data: {
                senderName: safeSenderName,
                senderEmail: safeSenderEmail,
                title: safeTitle,
                content: safeContent,
                images,
                status: 'PENDING'
            }
        });

        res.status(201).json({
            success: true,
            submission: newSubmission
        });
    } catch(err) {
        if (err?.code === "P2000") {
            return res.status(400).json({ success: false, message: "Submission text is too long." });
        }
        next(err);
    }
};

module.exports = {
    submitNews
};
