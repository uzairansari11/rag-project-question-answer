import { Worker } from 'bullmq';
import { connection } from '../config/redis.js';
import { QUEUE_NAMES } from '../constants/queue.constants.js';
import { processFlashcardJob } from '../jobs/flashcard.job.js';

const worker = new Worker(QUEUE_NAMES.FLASHCARD, processFlashcardJob, {
  connection: connection,
});

worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  console.log(`Job ${job?.id} failed`);
  console.error(err);
});
