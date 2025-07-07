import dotenv from 'dotenv';

dotenv.config(); 

interface EnvConfig {
  PORT: number; 
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  SECRET_JWT_KEY: string;
  redis: {
    REDIS_USER: string;
    REDIS_HOST: string;
    REDIS_PORT: number;
    REDIS_PASSWORD: string;
  };
}

export const config:EnvConfig = {
  PORT: Number(process.env.PORT) || 8080,
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: Number(process.env.DB_PORT) || 5432, 
  DB_USER: process.env.DB_USER || 'postgres',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_NAME: process.env.DB_NAME || 'postgres',
  SECRET_JWT_KEY: process.env.SECRET_JWT_KEY || 'fallback-secret',
  redis : {
    REDIS_USER: process.env.REDIS_USER || 'default',
    REDIS_HOST: process.env.REDIS_HOST || 'localhost',
    REDIS_PORT: Number(process.env.REDIS_PORT) || 6379,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD || ''
  }
  
};