import { createClient , RedisClientType} from 'redis';
import { config } from '../config/index';

let client: RedisClientType;

export const connectRedis = async () => {
  if (client) {
    return client; 
  }

  client = createClient({
    username: config.redis.REDIS_USER,
    password: config.redis.REDIS_PASSWORD,
    socket: {
      host: config.redis.REDIS_HOST,
      port: config.redis.REDIS_PORT,
    }
  });

  client.on('error', (err) => console.error('Redis Client Error', err));
  client.on('connect', () => console.log('Connected to Redis'));
  client.on('ready', () => console.log('Redis Client is ready'));
  await client.connect();
};

export const getRedisClient = () => client;




