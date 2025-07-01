import dotenv from 'dotenv';
import { parse } from 'path';

dotenv.config(); 

export const config = {
  PORT: process.env.PORT,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT, 
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD ,
  DB_NAME: process.env.DB_NAME ,
  SECRET_JWT_KEY: process.env.SECRET_JWT_KEY,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
};