import { Queue } from 'bullmq';
import { connection } from '../config/redis.js';
import { QUEUE_NAMES } from '../constants/queue.constants.js';

export const podcastQueue = new Queue(QUEUE_NAMES.PODCAST, {
  connection: connection,
});
