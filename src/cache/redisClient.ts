import Redis from 'ioredis';

let redisClient: Redis;

export const connectRedis = async () => {
  try {
    redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
    redisClient.on('connect', () => console.log('Redis connected!'));
    redisClient.on('error', (err) => console.error('Redis error:', err));
  } catch (error) {
    console.error('Error connecting to Redis:', error);
    throw error;
  }
};

export const getRedisClient = () => redisClient;