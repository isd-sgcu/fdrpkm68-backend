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
  PORT: Number(process.env.PORT),
  DB_HOST: process.env.DB_HOST!,
  DB_PORT: Number(process.env.DB_PORT!), 
  DB_USER: process.env.DB_USER!,
  DB_PASSWORD: process.env.DB_PASSWORD!,
  DB_NAME: process.env.DB_NAME!,
  SECRET_JWT_KEY: process.env.SECRET_JWT_KEY!,
  redis : {
    REDIS_USER: process.env.REDIS_USER!,
    REDIS_HOST: process.env.REDIS_HOST!,
    REDIS_PORT: Number(process.env.REDIS_PORT!),
    REDIS_PASSWORD: process.env.REDIS_PASSWORD!
  }
  
};