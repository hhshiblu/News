const prisma = require("../../db_query/prisma");

const submitContactMessage = async (req, res, next) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }

        const contact = await prisma.contactMessage.create({
            data: { name, email, subject, message }
        });

        res.status(201).json({ success: true, message: "Message sent successfully!", data: contact });
    } catch (err) {
        next(err);
    }
};

module.exports = { submitContactMessage };
