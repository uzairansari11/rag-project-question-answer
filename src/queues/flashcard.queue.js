import { Queue } from 'bullmq';
import { connection } from '../config/redis.js';
import { QUEUE_NAMES } from '../constants/queue.constants.js';

export const flashCardQueue = new Queue(QUEUE_NAMES.FLASHCARD, { connection: connection });
