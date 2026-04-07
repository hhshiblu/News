const prisma = require('../../db_query/prisma');

const subscribeNewsletter = async (req, res, next) => {
    try {
        const { email } = req.body;
        if(!email) return res.status(400).json({ success: false, message: 'Email required' });

        await prisma.newsletterSubscriber.create({
            data: { email }
        }).catch(err => {
            if(err.code === 'P2002') throw new Error("Email Already Subscribed");
            throw err;
        });

        res.status(201).json({ success: true, message: 'Subscribed successfully' });
    } catch (error) {
        if(error.message === 'Email Already Subscribed') return res.status(400).json({ success: false, message: error.message });
        next(error);
    }
}

module.exports = { subscribeNewsletter };
