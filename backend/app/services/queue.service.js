const { Queue, Worker } = require('bullmq');
const prisma = require('../db_query/prisma');

const connection = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  ...(process.env.REDIS_PASSWORD && { password: process.env.REDIS_PASSWORD }),
};

const postClicksQueue = new Queue('post-clicks', { connection });

const postClicksWorker = new Worker(
  'post-clicks',
  async (job) => {
    if (job.name !== 'increment-click') return;
    const { postId, slug } = job.data;
    let id = postId;
    if (!id && slug) {
      const p = await prisma.post.findFirst({
        where: { slug: String(slug), status: 'PUBLISHED' },
        select: { id: true },
      });
      if (!p) return;
      id = p.id;
    }
    if (!id) return;
    await prisma.post.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });
  },
  { connection }
);

postClicksWorker.on('failed', (job, err) => {
  console.error('[post-clicks]', job?.id, err?.message);
});

/** Enqueue a public article click (increments viewCount in DB). */
const addPostClickJob = async ({ postId, slug } = {}) => {
  if (!postId && !slug) return;
  await postClicksQueue.add('increment-click', { postId, slug });
};

module.exports = { addPostClickJob };
