import { Queue } from 'bullmq';
import { connection } from '../config/redis.js';
import { QUEUE_NAMES } from '../constants/queue.constants.js';
export const documentQueue = new Queue(QUEUE_NAMES.DOCUMENT_PROCESSING, {
  connection: connection,
});
