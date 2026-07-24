import Redis from 'ioredis';

export const connection = new Redis({
  // redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  host: '127.0.0.1',
  port: 6379,
  maxRetriesPerRequest: null,
});
