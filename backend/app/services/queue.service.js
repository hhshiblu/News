const { Queue, Worker } = require('bullmq');
const prisma = require('../db_query/prisma');

const connection = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT) || 6379,
};

// Queue Setup
const viewCountQueue = new Queue('post-views', { connection });

// Worker Setup (this would typically run in a separate process or server file in large scales)
const viewCountWorker = new Worker('post-views', async job => {
    if (job.name === 'increment-view') {
        const { postId } = job.data;
        // Efficient background db update
        await prisma.post.update({
            where: { id: postId },
            data: { viewCount: { increment: 1 } }
        });
    }
}, { connection });

viewCountWorker.on('completed', job => {
  console.log(`${job.id} has completed!`);
});

viewCountWorker.on('failed', (job, err) => {
  console.log(`${job.id} has failed with ${err.message}`);
});

// Service exposure
const addPostViewJob = async (postId) => {
    await viewCountQueue.add('increment-view', { postId });
};

module.exports = { addPostViewJob };
