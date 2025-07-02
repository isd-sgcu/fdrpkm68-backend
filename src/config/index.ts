import dotenv from 'dotenv';

dotenv.config(); 

interface EnvConfig {
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  SECRET_JWT_KEY: string;
}

export const config:EnvConfig = {
  DB_HOST: process.env.DB_HOST!,
  DB_PORT: Number(process.env.DB_PORT!), 
  DB_USER: process.env.DB_USER!,
  DB_PASSWORD: process.env.DB_PASSWORD!,
  DB_NAME: process.env.DB_NAME!,
  SECRET_JWT_KEY: process.env.SECRET_JWT_KEY!,
};