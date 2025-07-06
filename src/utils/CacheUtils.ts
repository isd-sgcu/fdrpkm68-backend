import { getRedisClient } from '../cache/redisClient';
import { CustomError } from '../types/error';

export const getCache = async (key: string): Promise<string | null> => {
  try {
    const cachedValue = await getRedisClient().get(key);
    return cachedValue;
  } catch (error) {
    const err: CustomError = new Error(`Failed to get cache for key ${key}`);
    err.statusCode = 500;
    throw err;    
  }
}

export const setCache = async (key: string, value: string): Promise<void> => {
  try {
    await getRedisClient().set(key, value, { EX: 3600 });
  } catch (error) {
    const err: CustomError = new Error(`Failed to set cache for key ${key}`);
    err.statusCode = 500;
    throw err;
  }
}

export const clearCache = async (key: string[]): Promise<void> => {
  try {
    await Promise.all(key.map(k => getRedisClient().del(k)));
  } catch (error) {
    const err: CustomError = new Error(`Failed to clear cache for key ${key}`);
    err.statusCode = 500;
    throw err;
  }
}