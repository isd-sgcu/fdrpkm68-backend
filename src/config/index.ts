import dotenv from 'dotenv';

dotenv.config(); 

export const config = {
  port: process.env.PORT || 3000,
  databaseUrl: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/mydatabase',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  jwtSecret: process.env.JWT_SECRET || 'super_secret_jwt_key', 
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
};