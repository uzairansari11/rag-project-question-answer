import { Worker } from 'bullmq';
import { connection } from '../config/redis.js';
import { QUEUE_NAMES } from '../constants/queue.constants.js';
import { processPodcastJob } from '../jobs/podcast.job.js';

export const worker = new Worker(QUEUE_NAMES.PODCAST, processPodcastJob, { connection });

worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  console.log(`Job ${job?.id} failed`);
  console.error(err);
});
